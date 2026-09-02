# jobs.ch / jobup.ch — URL and parsing reference

Parsing anchors for this skill. When `/scrape` reports the portal as `degraded` or
`broken`, this is the file to check the live site against.

All findings below were verified against the live sites on 2026-09-02.

## Hosts and search paths

The locale is part of the **path**, not a query parameter. A wrong path does not 404 — it
falls through to the site's generic landing page, which returns an unfiltered result set
that looks like a successful search. That is the failure mode to watch for.

| Site | Locale | Search path | Verified |
|------|--------|-------------|----------|
| `www.jobs.ch` | `de` | `/de/stellenangebote/` | ✅ |
| `www.jobs.ch` | `fr` | `/fr/offres-emplois/` | ✅ |
| `www.jobs.ch` | `en` | `/en/vacancies/` | ✅ |
| `www.jobup.ch` | `fr` | `/fr/emplois/` | ✅ |
| `www.jobup.ch` | `de` | — | ❌ falls through to landing page |
| `www.jobup.ch` | `en` | — | ❌ falls through to landing page |

Detail pages hang off the same localized stem:

```
https://www.jobs.ch/en/vacancies/detail/<uuid>/
https://www.jobs.ch/de/stellenangebote/detail/<uuid>/
https://www.jobup.ch/fr/emplois/detail/<uuid>/
```

A non-existent UUID returns HTTP **404** (verified), which `htmlFetch` maps to
`Job not found`.

## Query parameters

| Parameter | Values | Notes |
|-----------|--------|-------|
| `term` | free text | Keyword. Absent = no keyword filter. |
| `location` | free text | Town, canton, or region. URL-encoded (`Z%C3%BCrich`). |
| `page` | integer ≥ 1 | 20 results per page. Omitted when 1. |
| `publication-date` | **`1`, `7`, `14`, `31` only** | Any other value is **silently ignored** and returns unfiltered results. The CLI rejects other values for this reason. |
| `employment-grade-min` | `0`–`100` | Workload percentage floor. |
| `employment-grade-max` | `0`–`100` | Workload percentage ceiling. |

Measured behaviour of `publication-date` on `?term=python&location=Zurich`:

| Filter | Hits |
|--------|------|
| none | 110 |
| `publication-date=1` | 11 |
| `publication-date=7` | 28 |
| `publication-date=14` | 42 |

`sort` appears in the site's own URLs but did not change the result count or observable
ordering in testing, so the CLI does not expose it.

## robots.txt

`https://www.jobs.ch/robots.txt` and `https://www.jobup.ch/robots.txt` disallow, among
others:

- `/api/` and `/api_proxy/` — **the skill never calls these**
- `/de/stellenangebote/detail/*/*/*` (three path segments)
- `/login/`, `/de/auth/`, registration and email-application paths

Real detail URLs carry a **single** path segment after `detail/` (`/detail/<uuid>/`), so
they do not match the three-segment disallow rule. The search paths are not disallowed.

If the disallow list ever grows a rule matching `/detail/<uuid>/` or the search paths,
this skill must be disabled — flip `enabled: false` in `SKILL.md`.

## Parsing anchors

### Search page

The result set lives in a `<script type="application/ld+json">` block. The block is a JSON
**array** holding several nodes, in this order:

1. `WebSite`
2. `CollectionPage`
3. `BreadcrumbList`
4. **`ItemList`** ← the results

Select by `@type`, never by array index. Each `itemListElement[].item` is a `JobPosting`.

Fields observed on search cards:

| JSON-LD path | Maps to |
|--------------|---------|
| `title` | `title` |
| `identifier.value` | `id` (UUID) |
| `hiringOrganization.name` | `company` |
| `hiringOrganization.sameAs` | `companyUrl` |
| `jobLocation.address.addressLocality` | `location` |
| `jobLocation.address.addressCountry` | `location` fallback (`CH`) |
| `datePosted` | `date` (ISO, truncated to `YYYY-MM-DD`) |
| `employmentType` | `employmentType` |
| `url` | `url` |

Cards sometimes omit `identifier` and often omit `addressLocality`. The CLI falls back to
the UUID in `url` and to `addressCountry` respectively — an empty `company` or `location`
on *every* result is what `/scrape` Step 4.75 flags as a degraded parser.

### Total hit count

**Not in the JSON-LD.** It leads the `<title>`:

```
110 Python jobs in Zurich - jobs.ch
140 Informatiker Jobs in Bern - jobs.ch
335 postes pour Python - jobs.ch
153 offres d'emploi pour Python trouvées sur jobup.ch
```

Swiss digit grouping uses an apostrophe (`1'234`); the French locale can use a narrow
no-break space. A plain space is a **word boundary, not a separator** — treating it as one
would read `1 234` out of `1 Python job`. An untargeted search (`Jobs - jobs.ch`) has no
count, and the CLI falls back to the number of items on the page.

### Detail page

Two JSON-LD blocks: a `BreadcrumbList` and a full `JobPosting`. Fields beyond the search
card:

| JSON-LD path | Maps to | Notes |
|--------------|---------|-------|
| `description` | `description` | HTML fragment; converted to text, `<li>` → `- ` |
| `employerOverview` | `companyOverview` | Company self-description |
| `workHours` | `workload` | e.g. `42 - 42 hours/week` |
| `jobStartDate` | `startDate` | |
| `occupationalCategory.name` | `category` | |
| `potentialAction.target.urlTemplate` | `applyUrl` | |
| `address.streetAddress` + `postalCode` + `addressRegion` | `location` | Detail pages put the town in `addressRegion`, not `addressLocality` |
| `baseSalary` | `salary` | See below |

**`baseSalary` is always present and usually empty.** The live shape when nothing is
disclosed is `{"@type":"MonetaryAmount","currency":"CHF","value":{"@type":"QuantitativeValue"}}`
— an empty `value`. This must read as `null`, never as `CHF 0`. Swiss employers rarely
publish ranges.

**No application deadline.** `validThrough` is normally absent, so `deadline` is `null`.

## User agent

jobs.ch serves the complete server-rendered JSON-LD to
`Mozilla/5.0 (compatible; jobs-ch-cli/1.0)` — verified against the live site. No browser
impersonation is used. If the site ever starts gating on user agent, that is a signal to
re-read its terms before changing the header, not a bug to patch around.

## Known drift

Identical repeated requests return slightly different hit counts (110 vs 181 for the same
query minutes apart). The site personalizes and A/B-tests its result mix. `meta.total` is
approximate; do not build exact-count assertions on live data.

## `term` does not phrase-match

jobs.ch tokenises the query and matches terms independently. Searching
`wissenschaftlicher Mitarbeiter` returns postings for canteen staff, secretaries and
archivists, because they match the token `Mitarbeiter` alone. Quoting does not help.

Consequence for `/scrape`: for any multi-word job title, **filter client-side on the returned
`title`** rather than trusting the query to have done it. A sweep of 673 hits for
`wissenschaftlicher Mitarbeiter` variants returned 218 unique postings, of which only 20 had
a title that actually matched the intended sense. Reporting the raw count as "matches" would
overstate coverage by an order of magnitude.

The same applies to `Data Scientist` (matches "Scientist" alone: packaging, analytical
chemistry) and `Associate Consultant` (matches "Associate": Physician Associate, Research
Associate in wet-lab pharma).
