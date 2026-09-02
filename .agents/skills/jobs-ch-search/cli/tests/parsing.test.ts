import { describe, expect, test } from "bun:test"
import {
  buildSearchUrl,
  extractJsonLd,
  htmlToText,
  parseSearchPage,
  parseTotalFromTitle,
  resolveSite,
  searchPath,
} from "../src/helpers.js"
import { parseDetail } from "../src/commands/detail.js"
import { DETAIL_POSTING, detailPageHtml, searchPageHtml } from "./fixtures.js"

describe("parseSearchPage", () => {
  test("selects the ItemList by @type, not by position in the array", () => {
    // The live page ships WebSite + CollectionPage + BreadcrumbList before the
    // ItemList; picking the first node would silently yield zero results.
    const { results } = parseSearchPage(searchPageHtml())
    expect(results).toHaveLength(2)
    expect(results[0].title).toBe("Senior AI Machine Learning Engineer 100% (f/m/d)")
  })

  test("maps the /scrape Step 2 contract fields off a full card", () => {
    const { results } = parseSearchPage(searchPageHtml())
    expect(results[0]).toMatchObject({
      id: "4fb22d9e-9326-4f87-b5f9-4289c8b414a6",
      company: "UBS Card Center AG",
      location: "Glattbrugg",
      date: "2026-08-27",
      employmentType: "Permanent position",
      url: "https://www.jobs.ch/en/vacancies/detail/4fb22d9e-9326-4f87-b5f9-4289c8b414a6/",
    })
  })

  test("falls back to the URL UUID when a card carries no identifier", () => {
    const { results } = parseSearchPage(searchPageHtml())
    expect(results[1].id).toBe("1411661d-f16c-4668-93d3-e31b7799b499")
  })

  test("a card with only a country degrades to the country, never to an empty string", () => {
    // Step 4.75's degraded-portal scan treats empty location on every result as
    // a half-working parser, so the honest value has to survive.
    const { results } = parseSearchPage(searchPageHtml())
    expect(results[1].location).toBe("CH")
  })

  test("deadline is null rather than absent - /rank does date arithmetic on it", () => {
    const { results } = parseSearchPage(searchPageHtml())
    expect(results[0]).toHaveProperty("deadline")
    expect(results[0].deadline).toBeNull()
  })

  test("throws a diagnosable error when the ItemList is gone", () => {
    const html = "<html><head><title>Jobs - jobs.ch</title></head><body></body></html>"
    expect(() => parseSearchPage(html)).toThrow(/ItemList/)
  })

  test("ignores non-JobPosting entries mixed into the list", () => {
    const html = searchPageHtml({ items: [{ "@type": "Product", name: "Ad slot" }] })
    expect(parseSearchPage(html).results).toHaveLength(0)
  })

  test("survives a malformed JSON-LD block instead of throwing", () => {
    const html = searchPageHtml({
      extraScripts: '<script type="application/ld+json">{ not json }</script>',
    })
    expect(parseSearchPage(html).results).toHaveLength(2)
  })
})

describe("parseTotalFromTitle", () => {
  test.each([
    ["110 Python jobs in Zurich - jobs.ch", 110],
    ["140 Informatiker Jobs in Bern - jobs.ch", 140],
    ["335 postes pour Python - jobs.ch", 335],
    ["153 offres d'emploi pour Python trouvées sur jobup.ch", 153],
  ])("reads the leading count out of %p", (title, expected) => {
    expect(parseTotalFromTitle(`<title>${title}</title>`)).toBe(expected)
  })

  test("handles the Swiss apostrophe thousands separator", () => {
    expect(parseTotalFromTitle("<title>1'234 Python jobs - jobs.ch</title>")).toBe(1234)
  })

  test("a plain space is a word boundary, not a separator", () => {
    // "1 Python job" must read as 1, never as 1234-style grouping.
    expect(parseTotalFromTitle("<title>1 Python job in Bern - jobs.ch</title>")).toBe(1)
  })

  test("returns null for an untargeted search that has no count", () => {
    expect(parseTotalFromTitle("<title>Jobs - jobs.ch</title>")).toBeNull()
  })

  test("parseSearchPage falls back to the item count when the title has none", () => {
    expect(parseSearchPage(searchPageHtml({ title: "Jobs - jobs.ch" })).total).toBe(2)
  })
})

describe("buildSearchUrl", () => {
  const jobsCh = resolveSite("jobs.ch")

  test("localizes the path - the locale is not a query parameter", () => {
    expect(buildSearchUrl(jobsCh, "de", { term: "python" })).toBe(
      "https://www.jobs.ch/de/stellenangebote/?term=python",
    )
    expect(buildSearchUrl(jobsCh, "fr", { term: "python" })).toBe(
      "https://www.jobs.ch/fr/offres-emplois/?term=python",
    )
  })

  test("omits page=1 and emits page for later pages", () => {
    expect(buildSearchUrl(jobsCh, "en", { term: "x", page: 1 })).not.toContain("page=")
    expect(buildSearchUrl(jobsCh, "en", { term: "x", page: 3 })).toContain("page=3")
  })

  test("maps recency and workload onto the site's real parameter names", () => {
    const url = buildSearchUrl(jobsCh, "en", {
      term: "python",
      publicationDate: 7,
      employmentGradeMin: 80,
      employmentGradeMax: 100,
    })
    expect(url).toContain("publication-date=7")
    expect(url).toContain("employment-grade-min=80")
    expect(url).toContain("employment-grade-max=100")
  })

  test("encodes umlauts and accents in the location", () => {
    expect(buildSearchUrl(jobsCh, "de", { location: "Zürich" })).toContain("location=Z%C3%BCrich")
  })

  test("rejects a locale the host does not serve as a search page", () => {
    // jobup.ch/de/... resolves to the generic landing page, which would return
    // an unfiltered result set that looks like a successful search.
    expect(() => searchPath(resolveSite("jobup.ch"), "de")).toThrow(/not available/)
    expect(() => resolveSite("jobs.de")).toThrow(/unknown --site/)
  })
})

describe("parseDetail", () => {
  const parsed = parseDetail(detailPageHtml(), "https://example.invalid/")

  test("extracts the posting fields", () => {
    expect(parsed).toMatchObject({
      id: "53999177-f686-41e2-854b-2acefbfc8c19",
      title: "AI Engineer",
      company: "ti&m AG",
      employmentType: "Permanent position",
      workload: "42 - 42 hours/week",
      startDate: "2026-09-30",
      category: "Information Technology",
      applyUrl:
        "https://www.jobs.ch/en/vacancies/detail/53999177-f686-41e2-854b-2acefbfc8c19/apply",
    })
  })

  test("builds the Swiss postcode-first address from the detail page", () => {
    // Detail pages put the town in addressRegion and leave addressLocality empty.
    expect(parsed.location).toBe("Buckhauserstrasse 24, 8047 Zürich")
  })

  test("an empty baseSalary node reads as null, never as CHF 0", () => {
    // Swiss postings almost never disclose a range, but the node is always present.
    expect(parsed.salary).toBeNull()
  })

  test("reads a disclosed salary range when one is present", () => {
    const html = detailPageHtml({
      ...DETAIL_POSTING,
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "CHF",
        value: { "@type": "QuantitativeValue", minValue: 120000, maxValue: 140000, unitText: "YEAR" },
      },
    })
    expect(parseDetail(html, "x").salary).toBe("CHF 120000-140000 per year")
  })

  test("renders the HTML description as readable text with list bullets", () => {
    expect(parsed.description).toContain("Your role")
    expect(parsed.description).toContain("- Build RAG systems")
    expect(parsed.description).toContain("Apply now & join us.")
    expect(parsed.description).not.toContain("<")
  })

  test("throws a diagnosable error when the posting is gone", () => {
    const html = "<html><head><title>x</title></head><body></body></html>"
    expect(() => parseDetail(html, "x")).toThrow(/JobPosting/)
  })
})

describe("htmlToText", () => {
  test("decodes the German and French named entities Swiss ads use", () => {
    expect(htmlToText("<p>Z&uuml;rich &amp; Gen&egrave;ve, Stra&szlig;e</p>")).toBe(
      "Zürich & Genève, Strasse",
    )
  })

  test("collapses runs of blank lines", () => {
    expect(htmlToText("<p>a</p><p></p><p></p><p>b</p>")).toBe("a\n\nb")
  })
})

describe("extractJsonLd", () => {
  test("returns every well-formed block and skips broken ones", () => {
    const html =
      '<script type="application/ld+json">{"@type":"A"}</script>' +
      '<script type="application/ld+json">oops</script>' +
      '<script type="application/ld+json">[{"@type":"B"},{"@type":"C"}]</script>'
    expect(extractJsonLd(html).map((n) => n["@type"])).toEqual(["A", "B", "C"])
  })
})
