import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import {
  DEFAULT_SITE,
  extractJsonLd,
  htmlFetch,
  htmlToText,
  resolveSite,
  searchPath,
  writeError,
} from "../helpers.js"

interface DetailResult {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  companyOverview: string | null
  location: string | null
  date: string | null
  deadline: string | null
  employmentType: string | null
  workload: string | null
  startDate: string | null
  category: string | null
  salary: string | null
  applyUrl: string | null
  url: string
  description: string | null
}

/**
 * Detail URLs are `https://<host>/<locale>/<search-path-stem>/detail/<uuid>/`.
 * Accepts either a bare UUID or a full URL, matching the reference CLIs.
 */
function detailUrl(siteName: string, locale: string, id: string): string {
  if (/^https?:\/\//i.test(id)) return id
  const site = resolveSite(siteName)
  // searchPath() throws on an unsupported locale, which is what we want here
  // too: jobup.ch has no German detail page, and guessing one yields a 404.
  return `https://${site.host}${searchPath(site, locale)}detail/${id}/`
}

function formatLocation(jobLocation: any): string | null {
  const address = jobLocation?.address
  if (!address) return null
  const town = address.addressLocality || address.addressRegion || null
  if (!town) return address.addressCountry ? String(address.addressCountry) : null
  const street = address.streetAddress ? `${address.streetAddress}, ` : ""
  return address.postalCode ? `${street}${address.postalCode} ${town}` : `${street}${town}`
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string" || value.length < 10) return null
  const day = value.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null
}

/**
 * jobs.ch always emits a `baseSalary` node, but the `value` is an empty
 * QuantitativeValue unless the employer actually disclosed a figure - which is
 * the norm in Switzerland, where ranges are usually withheld until interview.
 * An empty node must read as null, never as "CHF 0".
 */
function formatSalary(baseSalary: any): string | null {
  const value = baseSalary?.value
  if (!value) return null
  const currency = baseSalary.currency ?? "CHF"
  const min = value.minValue
  const max = value.maxValue
  const single = value.value
  const unit = value.unitText ? ` per ${String(value.unitText).toLowerCase()}` : ""
  if (typeof min === "number" && typeof max === "number") {
    return `${currency} ${min}-${max}${unit}`
  }
  if (typeof single === "number") return `${currency} ${single}${unit}`
  return null
}

export function parseDetail(html: string, fallbackUrl: string): DetailResult {
  const nodes = extractJsonLd(html)
  const posting = nodes.find((n) => n["@type"] === "JobPosting")
  if (!posting) {
    throw new Error(
      "Could not locate a schema.org JobPosting on the detail page - the posting may " +
        "have been withdrawn, or the portal's markup changed; see url-reference.md",
    )
  }

  const description =
    typeof posting.description === "string" ? htmlToText(posting.description) : null

  return {
    id: posting?.identifier?.value ?? "",
    title: typeof posting.title === "string" ? posting.title : "",
    company: posting?.hiringOrganization?.name ?? null,
    companyUrl: posting?.hiringOrganization?.sameAs ?? posting?.sameAs ?? null,
    companyOverview:
      typeof posting.employerOverview === "string" ? htmlToText(posting.employerOverview) : null,
    location: formatLocation(posting.jobLocation),
    date: isoDate(posting.datePosted),
    // jobs.ch exposes no application deadline. `validThrough` is read when a
    // posting happens to carry it, but the field is normally absent.
    deadline: isoDate(posting.validThrough),
    employmentType: typeof posting.employmentType === "string" ? posting.employmentType : null,
    workload: typeof posting.workHours === "string" ? posting.workHours : null,
    startDate: isoDate(posting.jobStartDate),
    category: posting?.occupationalCategory?.name ?? null,
    salary: formatSalary(posting.baseSalary),
    applyUrl: posting?.potentialAction?.target?.urlTemplate ?? null,
    url: typeof posting.url === "string" ? posting.url : fallbackUrl,
    description: description && description.length > 0 ? description : null,
  }
}

export const detail = defineCommand({
  name: "detail",
  description: "Fetch the full description of a single job posting",
  options: {
    id: option(z.string().optional(), {
      description: "Job UUID from search results, or the full posting URL",
    }),
    site: option(z.enum(["jobs.ch", "jobup.ch"]).default(DEFAULT_SITE as "jobs.ch"), {
      description: "Portal the id belongs to (ignored when a full URL is passed)",
    }),
    locale: option(z.enum(["de", "fr", "en"]).default("en"), {
      description: "Site language: de, fr, or en. jobup.ch supports fr only",
    }),
    format: option(z.enum(["json", "plain"]).default("json"), {
      description: "Output format: json, plain",
    }),
  },
  handler: async ({ flags, positional, signal }) => {
    const id = flags.id ?? positional?.[0]
    if (!id) {
      writeError("a job id or posting URL is required", "MISSING_REQUIRED")
      process.exit(1)
    }

    if (signal.aborted) return

    try {
      const url = detailUrl(flags.site, flags.locale, id)
      const html = await htmlFetch(url)
      if (signal.aborted) return

      const result = parseDetail(html, url)

      if (flags.format === "json") {
        console.log(JSON.stringify(result, null, 2))
      } else {
        for (const [key, value] of Object.entries(result)) {
          if (key === "description") continue
          console.log(`${key}: ${value ?? "-"}`)
        }
        if (result.description) {
          console.log("")
          console.log(result.description)
        }
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "API_ERROR")
      process.exit(1)
    }
  },
})
