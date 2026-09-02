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
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search -q "Data Scientist" -l "Zürich" --locale en --jobage 14 --workload-min 80
bun run .agents/skills/jobs-ch-search/cli/src/cli.ts search -q "Datenanalyst"  -l "Zürich" --locale de --jobage 14 --workload-min 80
```

Translate titles into the German term Swiss employers actually post under, rather than
word-for-word: `Softwareentwickler` / `Applikationsentwickler`, `Sachbearbeiter`,
`Projektleiter`, `Fachspezialist`, `Wissenschaftlicher Mitarbeiter`, `Teamleiter`.

### Pensum filter

Swiss postings advertise a workload percentage, and part-time is common at every
seniority. Set it explicitly rather than letting 40–60% listings fill the results:
`--workload-min 80`. Anything below 80% is a deal-breaker (see CLAUDE.md).

## Query Categories

All four tracks are active. Run **every category in both German and English** - the result
sets differ substantially on jobs.ch and neither contains the other.

Each `--query` below is a jobs.ch CLI term. The `site:` lines are the WebSearch fallback for
portals without a CLI (jobscout24.ch, ostjob.ch, myscience.ch, company career pages).

Standing flags for every CLI call: `--location "Zürich"` (also run Bern, Basel, Luzern,
Zug, Winterthur, and St. Gallen for tracks 1-2), `--workload-min 80`, `--jobage 14`.

### Priority 1: Developer / data science

Strongest evidence, and the track with public proof (`polyviz`, `citygov`).

```
German : Data Scientist | Data Engineer | Datenanalyst | Statistiker | Softwareentwickler R
         Applikationsentwickler | Data Analyst öffentliche Verwaltung | Datenmanagement
         Business Intelligence | Datenarchitekt | wissenschaftlicher Programmierer
English: Data Scientist | Data Engineer | R Developer | Research Software Engineer
         Analytics Engineer | Data Analyst | Backend Developer Python
site:jobscout24.ch "Data Scientist" Zürich
site:swissdevjobs.ch R OR Python Zürich
```

### Priority 2: Applied social research / policy evaluation

```
German : Wissenschaftlicher Mitarbeiter | Projektleiter Forschung | Evaluation
         Politikanalyse | Raumentwicklung | Stadtentwicklung | Regionalentwicklung
         Sozialforschung | Statistik Kanton | Referent Grundlagen | Wohnungsmarkt
English: Research Associate | Policy Analyst | Evaluation Consultant | Urban Analytics
         Research Scientist | Postdoctoral Researcher
site:myscience.ch Sozialwissenschaften OR Raumentwicklung Schweiz
site:ostjob.ch wissenschaftlicher Mitarbeiter
```

### Priority 3: Survey operations / market research

```
German : Marktforschung | Umfrageforschung | Survey Manager | Studienleiter
         Projektleiter Marktforschung | Data Manager Marktforschung | Panelmanagement
English: Survey Operations | Research Consultant | Insights Analyst | Survey Programmer
         Quantitative Researcher | Panel Manager
site:jobscout24.ch Marktforschung Zürich
```

### Priority 4: Consulting

Most competitive and furthest from current work. Expect a lower hit rate, and do not let it
crowd out Priorities 1-3.

```
German : Consultant | Berater Öffentlicher Sektor | Junior Consultant | Strategieberatung
English: Associate Consultant | Analyst | Consultant Public Sector | Strategy Consultant
         Data Consultant
site:linkedin.com/jobs "Associate Consultant" Zürich Switzerland
```

### Employers to check directly

These post on their own sites and do not reliably appear on jobs.ch. Check career pages via
WebSearch each run: Sotomo, Interface Politikstudien, gfs.Bern, Ecoplan, EBP, Prognos, BAK
Economics, Avenir Suisse, cynkra, Intervista, LINK, Demoscope, YouGov Schweiz, LUSTAT,
Statistik Stadt Zürich, Statistisches Amt Kanton Zürich, BFS, WSL, ETH and UZH job portals.

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from your home.

**Measure Swiss commutes in SBB travel time, not kilometres.** The rail network makes
distance a poor proxy: Zürich–Bern is ~125 km but under an hour by direct IC, while a
30 km valley trip can take longer. Check the connection, not the map.

Base is **Zürich**. Acceptable areas:
- Zürich city and the wider agglomeration (Winterthur, Zug, Baden, Aarau, Schaffhausen)
- Luzern, Bern, Basel, St. Gallen - all roughly one hour or less by direct IC, acceptable
- Lausanne, Genève, Lugano - too far to commute daily; only with substantial remote work
- Anything requiring a relocation out of Zürich is a case-by-case decision, not automatic

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
