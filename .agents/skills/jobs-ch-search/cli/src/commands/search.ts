import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import {
  DEFAULT_SITE,
  buildSearchUrl,
  htmlFetch,
  parseSearchPage,
  resolveSite,
  writeError,
  type JobCard,
} from "../helpers.js"

export const search = defineCommand({
  name: "search",
  description: "Search for job listings on jobs.ch (or jobup.ch)",
  options: {
    query: option(z.string().optional(), {
      short: "q",
      description: "Keyword search (job title, skill, technology, company)",
    }),
    location: option(z.string().optional(), {
      short: "l",
      description: "Location: town, canton, or region (e.g. Zürich, Bern, Basel)",
    }),
    site: option(z.enum(["jobs.ch", "jobup.ch"]).default(DEFAULT_SITE as "jobs.ch"), {
      description: "Portal: jobs.ch (national) or jobup.ch (Romandie, French only)",
    }),
    locale: option(z.enum(["de", "fr", "en"]).default("en"), {
      description: "Site language: de, fr, or en. jobup.ch supports fr only",
    }),
    page: option(z.coerce.number().int().min(1).default(1), {
      description: "Page number (1-indexed, 20 results per page)",
    }),
    jobage: option(z.coerce.number().int().min(1).optional(), {
      description: "Max posting age in days: 1, 7, 14, or 31. Omit for all postings",
    }),
    "workload-min": option(z.coerce.number().int().min(0).max(100).optional(), {
      description: "Minimum workload percentage (Swiss part-time filter, e.g. 80)",
    }),
    "workload-max": option(z.coerce.number().int().min(0).max(100).optional(), {
      description: "Maximum workload percentage (e.g. 100)",
    }),
    limit: option(z.coerce.number().int().min(1).optional(), {
      description: "Cap total results the CLI outputs (client-side)",
    }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), {
      description: "Output format: json, table, plain",
    }),
  },
  handler: async ({ flags, signal }) => {
    if (!flags.query && !flags.location) {
      writeError(
        "at least one of --query or --location is required - an unfiltered search " +
          "returns the portal's entire database",
        "MISSING_REQUIRED",
      )
      process.exit(1)
    }

    // jobs.ch only accepts these four buckets. Any other value is silently
    // dropped by the site, which would return unfiltered results while looking
    // like a successful recency filter - the exact failure the CLI's
    // unknown-flag guard exists to prevent, so it is rejected here too.
    if (flags.jobage !== undefined && ![1, 7, 14, 31].includes(flags.jobage)) {
      writeError(
        `--jobage must be one of 1, 7, 14, 31 (got ${flags.jobage}) - jobs.ch ignores ` +
          "any other value and would return unfiltered results",
        "INVALID_FLAG",
      )
      process.exit(1)
    }

    const workloadMin = flags["workload-min"]
    const workloadMax = flags["workload-max"]
    if (workloadMin !== undefined && workloadMax !== undefined && workloadMin > workloadMax) {
      writeError(
        `--workload-min (${workloadMin}) cannot exceed --workload-max (${workloadMax})`,
        "INVALID_FLAG",
      )
      process.exit(1)
    }

    if (signal.aborted) return

    try {
      const site = resolveSite(flags.site)
      const url = buildSearchUrl(site, flags.locale, {
        term: flags.query,
        location: flags.location,
        page: flags.page,
        publicationDate: flags.jobage,
        employmentGradeMin: workloadMin,
        employmentGradeMax: workloadMax,
      })

      const html = await htmlFetch(url)
      if (signal.aborted) return

      const parsed = parseSearchPage(html)
      let results = parsed.results
      if (flags.limit !== undefined) {
        results = results.slice(0, flags.limit)
      }

      const output = {
        meta: {
          total: parsed.total,
          page: flags.page,
          perPage: 20,
          site: flags.site,
          locale: flags.locale,
          searchUrl: url,
        },
        results,
      }

      if (flags.format === "json") {
        console.log(JSON.stringify(output, null, 2))
      } else if (flags.format === "table") {
        outputTable(results)
      } else {
        outputPlain(results)
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "API_ERROR")
      process.exit(1)
    }
  },
})

function outputTable(results: JobCard[]): void {
  console.log(
    "id                                   title                                    company              location",
  )
  for (const r of results) {
    const id = r.id.padEnd(36)
    const title = r.title.substring(0, 40).padEnd(40)
    const company = (r.company ?? "-").substring(0, 20).padEnd(20)
    const location = r.location ?? "-"
    console.log(`${id} ${title} ${company} ${location}`)
  }
}

function outputPlain(results: JobCard[]): void {
  for (const r of results) {
    console.log(`id: ${r.id}`)
    console.log(`title: ${r.title}`)
    console.log(`company: ${r.company ?? "-"}`)
    console.log(`location: ${r.location ?? "-"}`)
    console.log(`date: ${r.date ?? "-"}`)
    console.log(`deadline: ${r.deadline ?? "-"}`)
    console.log(`employmentType: ${r.employmentType ?? "-"}`)
    console.log(`workload: ${r.workload ?? "-"}`)
    console.log(`url: ${r.url}`)
    if (r.description) console.log(`description: ${r.description}`)
    console.log("")
  }
}
