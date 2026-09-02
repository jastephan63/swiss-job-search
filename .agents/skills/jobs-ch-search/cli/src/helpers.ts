/**
 * Shared fetch + parse layer for the jobs.ch / jobup.ch CLI.
 *
 * Unlike the Danish reference portals, which scrape CSS classes or a
 * hand-rolled `var Stash = {...}` blob, jobs.ch server-renders a
 * schema.org JSON-LD payload on both the search page (an `ItemList` of
 * `JobPosting` items) and the detail page (a single full `JobPosting`).
 * Parsing that instead of the markup is what keeps this CLI stable: the
 * site is free to restyle its cards without breaking us, and the fields
 * arrive already typed and named.
 */

/** A jobs.ch-family site. Both run the same platform, so one parser serves both. */
export interface Site {
  /** Host, without protocol. */
  host: string
  /**
   * Locale code -> search path segment. jobs.ch localizes the path itself
   * (`/de/stellenangebote/`, `/fr/offres-emplois/`, `/en/vacancies/`), so the
   * locale is not a query parameter and a wrong path silently returns the
   * generic landing page instead of a search result.
   */
  searchPaths: Record<string, string>
}

export const SITES: Record<string, Site> = {
  // German-speaking Switzerland and the national market. All three locales
  // resolve to real search pages.
  "jobs.ch": {
    host: "www.jobs.ch",
    searchPaths: {
      de: "/de/stellenangebote/",
      fr: "/fr/offres-emplois/",
      en: "/en/vacancies/",
    },
  },
  // Romandie. Same platform and same JSON-LD, but only the French path is a
  // real search page - `/de/stellenangebote/` and `/en/vacancies/` on this host
  // both fall through to the untargeted landing page, which would return an
  // unfiltered result set that looks like a successful search. Only `fr` is
  // offered so that failure is impossible to reach.
  "jobup.ch": {
    host: "www.jobup.ch",
    searchPaths: {
      fr: "/fr/emplois/",
    },
  },
}

export const DEFAULT_SITE = "jobs.ch"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export function resolveSite(name: string): Site {
  const site = SITES[name]
  if (!site) {
    throw new Error(
      `unknown --site '${name}' - supported sites: ${Object.keys(SITES).join(", ")}`,
    )
  }
  return site
}

export function searchPath(site: Site, locale: string): string {
  const path = site.searchPaths[locale]
  if (!path) {
    throw new Error(
      `--locale '${locale}' is not available on ${site.host} - supported locales: ` +
        `${Object.keys(site.searchPaths).join(", ")}`,
    )
  }
  return path
}

export interface SearchParams {
  term?: string
  location?: string
  page?: number
  /** Max posting age in days. jobs.ch accepts 1, 7, 14, 31. */
  publicationDate?: number
  /** Workload percentage floor/ceiling. Swiss postings are routinely 60-100%. */
  employmentGradeMin?: number
  employmentGradeMax?: number
}

export function buildSearchUrl(site: Site, locale: string, params: SearchParams): string {
  const qs = new URLSearchParams()
  if (params.term) qs.set("term", params.term)
  if (params.location) qs.set("location", params.location)
  if (params.page && params.page > 1) qs.set("page", String(params.page))
  if (params.publicationDate) qs.set("publication-date", String(params.publicationDate))
  if (params.employmentGradeMin !== undefined) {
    qs.set("employment-grade-min", String(params.employmentGradeMin))
  }
  if (params.employmentGradeMax !== undefined) {
    qs.set("employment-grade-max", String(params.employmentGradeMax))
  }
  const query = qs.toString()
  return `https://${site.host}${searchPath(site, locale)}${query ? `?${query}` : ""}`
}

export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        // jobs.ch serves the full server-rendered JSON-LD to this honest
        // identifier - verified against the live site - so the CLI never needs
        // to impersonate a browser to work.
        "User-Agent": "Mozilla/5.0 (compatible; jobs-ch-cli/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de-CH,de;q=0.9,en;q=0.8,fr;q=0.7",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (response.status === 404) {
      throw new Error("Job not found")
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

/** Every JSON-LD block on the page, parsed. Malformed blocks are skipped, not fatal. */
export function extractJsonLd(html: string): any[] {
  const out: any[] = []
  const pattern = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    let parsed: unknown
    try {
      parsed = JSON.parse(match[1])
    } catch {
      continue
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (node && typeof node === "object") out.push(node)
    }
  }
  return out
}

function findByType(nodes: any[], type: string): any | null {
  for (const node of nodes) {
    if (node["@type"] === type) return node
  }
  return null
}

/**
 * Total hit count, which the JSON-LD does not carry.
 *
 * The page title leads with it in every locale we support:
 *   "110 Python jobs in Zurich - jobs.ch"
 *   "140 Informatiker Jobs in Bern - jobs.ch"
 *   "335 postes pour Python - jobs.ch"
 *   "153 offres d'emploi pour Python trouvées sur jobup.ch"
 *
 * Swiss digit grouping uses an apostrophe (1'234) and the French locale can use
 * a narrow no-break space, so both are consumed as separators. A plain space is
 * deliberately *not* a separator - it is the boundary before the first word, and
 * treating it as one would read "1 234" out of "1 Python job".
 *
 * An untargeted search ("Jobs - jobs.ch") has no count in the title; callers
 * fall back to the page's own item count.
 */
export function parseTotalFromTitle(html: string): number | null {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)
  if (!title) return null
  const leading = title[1].trim().match(/^(\d[\d'’.  ]*)/)
  if (!leading) return null
  const digits = leading[1].replace(/[^\d]/g, "")
  if (!digits) return null
  const value = parseInt(digits, 10)
  return Number.isFinite(value) ? value : null
}

/**
 * The /scrape Step 2 contract shape. `title`, `company`, `location`, `date` and
 * `url` are the fields tests/test_scrape_contract.py requires every portal CLI
 * to emit; the rest are jobs.ch extras that survive into /rank.
 */
export interface JobCard {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  location: string | null
  date: string | null
  deadline: string | null
  employmentType: string | null
  workload: string | null
  url: string
  description: string | null
}

/** JSON-LD `PostalAddress` -> a single human-readable locality string. */
function formatLocation(jobLocation: any): string | null {
  const address = jobLocation?.address
  if (!address) return null
  // addressLocality is present on search cards; detail pages sometimes put the
  // town in addressRegion instead and leave locality empty.
  const town = address.addressLocality || address.addressRegion || null
  const parts = [town, address.postalCode ? String(address.postalCode) : null].filter(Boolean)
  if (parts.length === 0) {
    return address.addressCountry ? String(address.addressCountry) : null
  }
  // "8152 Glattbrugg" - Swiss postcode-first convention.
  return address.postalCode && town ? `${address.postalCode} ${town}` : String(parts[0])
}

/** ISO timestamp -> YYYY-MM-DD. /scrape does date arithmetic on this field. */
function isoDate(value: unknown): string | null {
  if (typeof value !== "string" || value.length < 10) return null
  const day = value.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null
}

function jobIdFrom(item: any): string {
  const identifier = item?.identifier
  if (identifier && typeof identifier.value === "string" && identifier.value) {
    return identifier.value
  }
  // Fall back to the UUID in the canonical URL: .../detail/<uuid>/
  const url = typeof item?.url === "string" ? item.url : ""
  const fromUrl = url.match(/\/detail\/([0-9a-fA-F-]{8,})\/?/)
  return fromUrl ? fromUrl[1] : ""
}

export function jobPostingToCard(item: any): JobCard {
  return {
    id: jobIdFrom(item),
    title: typeof item?.title === "string" ? item.title : "",
    company: item?.hiringOrganization?.name ?? null,
    companyUrl: item?.hiringOrganization?.sameAs ?? item?.sameAs ?? null,
    location: formatLocation(item?.jobLocation),
    date: isoDate(item?.datePosted),
    // jobs.ch postings carry no application deadline in the JSON-LD. The field
    // stays in the shape because /scrape and /rank read it; null is the honest
    // value, not a missing key.
    deadline: null,
    employmentType: typeof item?.employmentType === "string" ? item.employmentType : null,
    workload: typeof item?.workHours === "string" ? item.workHours : null,
    url: typeof item?.url === "string" ? item.url : "",
    description: null,
  }
}

export interface SearchPageResult {
  total: number
  results: JobCard[]
}

export function parseSearchPage(html: string): SearchPageResult {
  const nodes = extractJsonLd(html)
  const list = findByType(nodes, "ItemList")
  if (!list) {
    throw new Error(
      "Could not locate a schema.org ItemList in the search page - the portal's " +
        "markup may have changed; see url-reference.md for the parsing anchors",
    )
  }
  const elements: any[] = Array.isArray(list.itemListElement) ? list.itemListElement : []
  const results = elements
    .map((element) => element?.item)
    .filter((item) => item && item["@type"] === "JobPosting")
    .map(jobPostingToCard)

  const total = parseTotalFromTitle(html)
  return { total: total ?? results.length, results }
}

/** Convert a Unicode code point to a string, dropping out-of-range values. */
function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // German umlauts and the French accents that appear as named entities in
    // employer-supplied ad markup across the three Swiss language regions.
    .replace(/&auml;/g, "ä")
    .replace(/&Auml;/g, "Ä")
    .replace(/&ouml;/g, "ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&szlig;/g, "ss")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&agrave;/g, "à")
    .replace(/&ccedil;/g, "ç")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

/**
 * JSON-LD `description` arrives as an HTML fragment. Block-level tags become
 * newlines and list items become "- " bullets before tags are stripped, so the
 * requirements list stays readable instead of collapsing into one paragraph.
 */
export function htmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\s*li[^>]*>/gi, "\n- ")
      .replace(/<\s*\/\s*(p|div|ul|ol|li|h[1-6]|tr)\s*>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
}
