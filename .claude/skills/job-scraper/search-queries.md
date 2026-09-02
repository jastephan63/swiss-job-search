# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Shipped country-agnostic CLIs include `linkedin-search` and `freehire-search`; Danish demos and any skill you add with `/add-portal` are included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

**Language scope:** write every query category in every language listed in your CLAUDE.md Languages table (typically 1-2, sometimes more). A posting requiring a language you have *not* declared, as a job condition, is excluded before scoring; a posting requiring a *higher level* than you declared in a language you *do* work in is flagged for your own judgment, not excluded — see `04-job-evaluation.md`'s Language Gate, the single source of truth for this rule. Translate each category's keywords rather than machine-translating word-for-word (e.g. "Frontend Developer" -> "Desarrollador Frontend", not a literal word-for-word translation) if you work in more than one language.

## Market: Switzerland

This fork targets **German-speaking Switzerland plus English-language roles nationally**.
Market conventions live in `job-application-assistant/10-swiss-market.md`; this file covers
only how to *find* the postings.

### Search Sites

Primary (have a CLI - `/scrape` runs these automatically, no `site:` line needed):
- **jobs.ch** - the largest Swiss job platform. `jobs-ch-search` CLI
- **jobup.ch** - Romandie sibling of jobs.ch, same platform. `jobs-ch-search --site jobup.ch`
- **linkedin.com/jobs** - `linkedin-search` CLI, pass `-l "Zurich, Switzerland"` etc.
- **freehire.me** - multi-market tech aggregator. `freehire-search` CLI

Secondary (WebSearch fallback - no CLI, use the `site:` templates below):
- **jobscout24.ch** - large general board
- **ostjob.ch** - Eastern Switzerland (St. Gallen, Thurgau, Appenzell)
- **jobagent.ch** - aggregator
- **myscience.ch** - academic and research posts (ETH, EPFL, PSI, Empa, universities)
- **swissdevjobs.ch** - Swiss software roles
- Company career pages via `site:` searches for known target employers

> **Not usable, do not add:** `arbeit.swiss` / `job-room.ch` (the federal RAV portal). Its
> API requires authentication and its `robots.txt` disallows `/job-search/`. Verified
> 2026-09-02.

### Searching a bilingual market

The single highest-leverage habit in Switzerland: **run every priority category twice, in
German and in English.** The two return substantially different result sets and neither is
a superset of the other. Many Swiss SME postings exist only in German; many pharma, banking,
and big-tech postings only in English.

With the CLI this is the `--locale` flag, which switches the site's *search path* and not
just its interface language:

```bash
# same role, two languages, materially different results
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search -q "[YOUR_PRIMARY_JOB_TITLE_1]" -l "[YOUR_CITY]" --locale en --jobage 14
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search -q "[YOUR_PRIMARY_JOB_TITLE_1_DE]" -l "[YOUR_CITY]" --locale de --jobage 14
```

Translate titles into the German term Swiss employers actually post under, rather than
word-for-word: `Softwareentwickler` / `Applikationsentwickler`, `Sachbearbeiter`,
`Projektleiter`, `Fachspezialist`, `Wissenschaftlicher Mitarbeiter`, `Teamleiter`.

### Pensum filter

Swiss postings advertise a workload percentage, and part-time is common at every
seniority. Set it explicitly rather than letting 40–60% listings fill the results:
`--workload-min [YOUR_MIN_PENSUM]` (use `80` for effectively-full-time, `100` for strict).

## Query Categories

Queries are grouped by priority. Write **each category in every language from your Languages table** (see Language scope above). Combine each query with your location terms (e.g. your city, region, or metro area) where the site supports it.

**Organize by function, not job title.** The same underlying work carries different titles across companies and markets (a "Data Scientist" role at one employer may be posted as "Insights Analyst" or "Data Consultant" at another). Name each priority category after the function it covers, and list several plausible job titles as query variants within that category rather than betting an entire priority tier on one exact title string.

### Priority 1: [YOUR_PRIMARY_ROLE_TYPE]

These match your strongest and most desired career direction.

```
site:[YOUR_JOB_BOARD] "[YOUR_PRIMARY_JOB_TITLE_1]" [YOUR_CITY]
site:[YOUR_JOB_BOARD] "[YOUR_PRIMARY_JOB_TITLE_2]" [YOUR_CITY]
site:[YOUR_JOB_BOARD] "[YOUR_KEY_SKILL]" [YOUR_CITY]
site:linkedin.com/jobs "[YOUR_PRIMARY_JOB_TITLE_1]" [YOUR_COUNTRY]
```

### Priority 2: [YOUR_DOMAIN_EXPERTISE]

These match your domain expertise.

```
site:[YOUR_JOB_BOARD] [YOUR_DOMAIN_KEYWORD_1] [YOUR_CITY] OR [YOUR_REGION]
site:[YOUR_JOB_BOARD] [YOUR_DOMAIN_KEYWORD_2] [YOUR_COUNTRY]
site:linkedin.com/jobs [YOUR_DOMAIN_KEYWORD_1] [YOUR_CITY] [YOUR_COUNTRY]
```

### Priority 3: [YOUR_ADJACENT_ROLE_TYPE]

Adjacent roles you could pivot into.

```
site:[YOUR_JOB_BOARD] "[YOUR_ADJACENT_TITLE_1]" [YOUR_KEY_SKILL] [YOUR_CITY]
site:[YOUR_JOB_BOARD] "[YOUR_ADJACENT_TITLE_2]" [YOUR_KEY_SKILL] [YOUR_CITY]
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical roles.

```
site:[YOUR_JOB_BOARD] [YOUR_KEY_SKILL] developer [YOUR_CITY]
site:linkedin.com/jobs "[YOUR_KEY_SKILL] developer" [YOUR_CITY]
site:[YOUR_JOB_BOARD] "technical consultant" [YOUR_DOMAIN] [YOUR_CITY]
```

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from your home.

**Measure Swiss commutes in SBB travel time, not kilometres.** The rail network makes
distance a poor proxy: Zürich–Bern is ~125 km but under an hour by direct IC, while a
30 km valley trip can take longer. Check the connection, not the map.

Define acceptable areas:
- [YOUR_CITY] and surrounding areas
- [ACCEPTABLE_AREA_1]
- [ACCEPTABLE_AREA_2]
- [BORDERLINE_AREA] (borderline - ~X min by SBB)
- [TOO_FAR_AREA] (too far)

**Canton matters beyond the commute.** Income tax varies materially between cantons, so a
larger gross in one canton can be a smaller net in another. Note the canton on results, and
flag the effect when comparing offers across cantons - see `10-swiss-market.md` §5.

## Language Filter

Your working languages and levels are in CLAUDE.md's Languages table. When filtering scraped results, apply `04-job-evaluation.md`'s Language Gate: a posting requiring a language you haven't declared at all is excluded; a posting requiring a higher level than you declared in a language you do work in is not excluded, flag it clearly instead (see `job-scraper/SKILL.md`'s Step 3 "Quick Fit Assessment" for how the flag surfaces in `/scrape` output). Postings simply *written* in a language you don't work in, that don't require it on the job, are fine.

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
