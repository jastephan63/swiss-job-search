---
name: jobs-ch-search
version: 1.0.0
description: >
  Make sure to use this skill whenever the user wants to search for jobs in Switzerland,
  find Swiss job listings, look up a specific Swiss job posting, or asks anything about
  the Swiss job market — even if they don't mention jobs.ch explicitly. Invoke this skill
  for questions about open positions, vacancies, or hiring in Switzerland, in Swiss cities
  or cantons, or when the user wants to find work in Switzerland. Also trigger for phrases
  like "find me a job in Zurich", "are there any jobs for X in Basel", or "what jobs are
  available in Bern". Trigger phrases include: jobs.ch, jobup.ch, Stellensuche, Stellenangebote,
  offene Stellen, Jobsuche Schweiz, Stelleninserat, Vakanz, Arbeit in der Schweiz, Job Schweiz,
  emploi Suisse, offres d'emploi, postes vacants, recherche d'emploi, jobs in switzerland,
  swiss jobs, job search switzerland, work in switzerland, vacancies switzerland, hiring
  switzerland, jobs zurich, jobs zürich, jobs geneva, jobs genève, jobs basel, jobs bern,
  jobs lausanne, jobs lugano, jobs zug, python jobs switzerland, software engineer zurich,
  data scientist switzerland, pharma jobs basel, finance jobs zurich, Informatiker Stelle,
  Ingenieur Stelle Schweiz, Teilzeit 80% Stelle.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/jobs-ch-search/cli/src/cli.ts *)
---

# jobs.ch / jobup.ch Search Skill

Search live Swiss job listings. No authentication needed, no API key.

`jobs.ch` is the largest job platform in Switzerland and the default. `jobup.ch` is its
Romandie sibling — same company, same platform, same data shape — so a single `--site`
flag switches between them.

## Why this parser is stable

Both sites server-render a **schema.org JSON-LD** payload: an `ItemList` of `JobPosting`
items on the search page, and a single full `JobPosting` on the detail page. This skill
parses that, not the markup. The sites can restyle their result cards freely without
breaking the CLI, and the fields arrive already typed and named.

## When to use this skill

Invoke this skill when the user wants to:

- Search for job openings anywhere in Switzerland by keyword, title, or technology
- Find jobs in a specific Swiss town, canton, or region
- Filter by **workload percentage** — Swiss postings are routinely advertised at 60%, 80%,
  or 80–100%, and this is a first-class filter, not an afterthought
- Filter by how recently a job was posted
- Get the full description, employer overview, and apply link for a specific posting
- Search in German, French, or English

## Commands

### Search job listings

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search [flags]
```

Key flags:

- `--query <text>` / `-q <text>` — keyword search (title, skill, technology, company)
- `--location <text>` / `-l <text>` — town, canton, or region (e.g. `Zürich`, `Bern`, `Basel`)
- `--site <name>` — `jobs.ch` (default, national) or `jobup.ch` (Romandie)
- `--locale <code>` — `de`, `fr`, or `en` (default `en`). **`jobup.ch` supports `fr` only.**
- `--jobage <days>` — max posting age: **`1`, `7`, `14`, or `31` only**. Omit for all postings.
- `--workload-min <pct>` / `--workload-max <pct>` — workload percentage, `0`–`100`
- `--page <n>` — page number (1-indexed, 20 results per page)
- `--limit <n>` — cap total results the CLI outputs (client-side)
- `--format json|table|plain`

At least one of `--query` or `--location` is **required** — without either, the site returns
its entire database.

> **`--jobage` takes only 1, 7, 14, or 31.** jobs.ch silently ignores any other value and
> returns *unfiltered* results that look like a successful filter, so the CLI rejects
> anything else with exit code 1 rather than letting that through.

### Fetch full job detail

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts detail <id> [flags]
```

`id` is the UUID from `search` results (e.g. `53999177-f686-41e2-854b-2acefbfc8c19`). A full
posting URL works too. Flags: `--site`, `--locale`, `--format json|plain`.

Returns the full description plus `employerOverview` (the company's own self-description —
useful raw material for `/apply`'s reviewer agent), address, workload hours, occupational
category, start date, and the direct apply URL.

---

## How to use effectively

**Natural workflow: `search` → `detail`.** Search to find matching jobs and their `id`
values, then `detail <id>` for the full description and apply link.

**Use `--locale de` for German-speaking Switzerland.** The site localizes its *path*
(`/de/stellenangebote/`, `/fr/offres-emplois/`, `/en/vacancies/`), and the locale changes
which postings rank, not just the interface language. Searching German keywords
(`Informatiker`, `Sachbearbeiter`, `Projektleiter`) under `--locale de` surfaces postings
that an English query misses entirely — many Swiss SME listings exist only in German.

**Run the query twice, once per language, for broad sweeps.** A Zürich search for
`software engineer --locale en` and `Softwareentwickler --locale de` return substantially
different sets. Neither is a superset of the other.

**Use `--workload-min` when full-time matters.** A large share of Swiss postings are part
time. `--workload-min 80` drops the 40–60% listings that otherwise dominate some sectors.

**Use `--jobage 7` or `--jobage 14` for fresh listings.** Without it, results include older
postings that may already be filled.

---

## Usage examples

### Machine learning jobs in Zürich, posted in the last two weeks

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search \
  --query "machine learning engineer" \
  --location "Zürich" \
  --jobage 14 \
  --format table
```

### The same search in German, which surfaces different postings

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search \
  --query "Machine Learning Ingenieur" \
  --location "Zürich" \
  --locale de \
  --jobage 14 \
  --format table
```

### Full-time only (80–100% workload), Basel

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search \
  --query python \
  --location Basel \
  --workload-min 80 \
  --workload-max 100 \
  --format json
```

### Romandie, via jobup.ch

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search \
  --query "data engineer" \
  --location "Genève" \
  --site jobup.ch \
  --locale fr \
  --format table
```

### Second page of results

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search \
  --query "product manager" \
  --location Zug \
  --page 2 \
  --format json
```

### Full details for a specific posting

```bash
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts detail \
  53999177-f686-41e2-854b-2acefbfc8c19 --format plain
```

---

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single posting's full detail |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process
exits with code `1`. Unknown flags are rejected rather than silently ignored.

---

## Notes and limitations

- Public pages only, no credentials. The CLI identifies itself honestly as
  `jobs-ch-cli/1.0` — jobs.ch serves the full payload to it, so no browser
  impersonation is used or needed. `robots.txt` allows the search and detail paths this
  skill touches; it disallows `/api/` and `/api_proxy/`, which the skill never calls.
- Personal-use volume. Keep runs to what a job seeker would plausibly do by hand.
- **No application deadline.** jobs.ch does not publish one, so `deadline` is always `null`.
  This is honest absence, not a parse failure — deadlines have to come from the posting text.
- **Salary is usually absent.** Swiss employers rarely publish ranges. The JSON-LD always
  carries a `baseSalary` node, but its value is empty unless disclosed; the CLI reports
  `null` in that case rather than inventing a figure. Use `salary_lookup.py` with Swiss
  wage data for benchmarking instead.
- Page size is fixed at 20 results per page.
- `jobup.ch` serves a real search page **only** at its French path. The German and English
  paths on that host fall through to an untargeted landing page, so the CLI rejects those
  locale/site combinations rather than returning an unfiltered result set.
- Result counts drift slightly between identical requests — the site personalizes and
  A/B-tests its result mix. Treat `meta.total` as approximate.
