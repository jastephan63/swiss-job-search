# Swiss Market Conventions

Rules that apply to applications in Switzerland and nowhere else in this framework. Read
this before evaluating a Swiss posting (Step 1), before drafting (Steps 2–3), and before
interview prep (Step 4).

Where a convention differs by language region or by employer type, that is stated. The
biggest single split is **Swiss-domestic employers** (SMEs, cantonal and federal
administration, healthcare, trades, insurance) versus **international employers**
(pharma in Basel, banks and big tech in Zürich, EPFL/ETH, CERN, commodity trading in
Geneva/Zug). The first group applies in the local language; the second often runs entirely
in English on Anglo-American norms. Getting the language wrong is the visible mistake.

---

## 1. What to send

Default to **CV + cover letter**. That is what most Swiss applications are, including at
consultancies, research institutes, and private-sector employers, and it is what online
portals accept.

The exception is parts of the **public sector** — cantonal and municipal offices, statistics
offices, administrations — where a posting may ask for a full *Bewerbungsdossier*: cover
letter, CV, Arbeitszeugnisse, and diplomas combined into one PDF, in that order. Send the
dossier when the posting asks for it. Do not volunteer one otherwise; it is not the default
and padding an application with certificates nobody asked for does not help.

## 2. Photo on the CV

Optional, and increasingly skipped. Some Swiss-domestic employers still expect one and some
explicitly request none for anonymised screening. Follow the posting; when it is silent,
either choice is defensible. Omit it for anything running an Anglo-American process or a US
or UK parent company's ATS, where a photo is actively wrong.

## 3. Arbeitszeugnis — the reference certificate

Under **OR Art. 330a**, every Swiss employer owes a written reference on request, and the
convention is that it is worded positively throughout with the real assessment carried by
formula choice. Two practical consequences:

- Keep CV claims consistent with what a reference would support. When a dossier includes the
  Zeugnisse, the recruiter has both documents in the same PDF.
- If a role on the CV has no reference and one may be asked for, a *Zwischenzeugnis* covers
  a role still in progress, and OR 330a allows requesting one from a past employer
  retroactively.

## 4. Pensum — workload percentage

Swiss roles are advertised as a percentage, and it is a genuine negotiating dimension
rather than a formality: `100%`, `80%`, `60–80%`, `80–100%`.

- Treat a range in the posting as an invitation to state a preference. Say which figure is
  being applied for, in the cover letter, when the posting gives a range.
- A user who wants less than 100% should say so in the application rather than at offer
  stage. Part-time is normalised here at all seniorities, and raising it late reads worse
  than raising it early.
- `jobs-ch-search` filters on this directly via `--workload-min` / `--workload-max`.
- Watch for a Pensum that conflicts with a deal-breaker: an 80% role at 80% of the salary
  is a pay cut, not a perk, unless the user actually wants the time.

---

## 5. Compensation

- **Currency and basis.** Annual gross in **CHF**. Always establish whether a quoted figure
  is on 12 or 13 months before comparing offers — the same "CHF 130,000" differs by a full
  month's pay depending on the answer.
- **13. Monatslohn.** Common but **not** legally required; it is contractual. Its presence,
  absence, or pro-rating is a term to confirm, not assume.
- **Ranges are rarely published.** `jobs-ch-search` reports `salary: null` for almost every
  posting because the JSON-LD field is genuinely empty, not because parsing failed. Expect
  to be asked `Was sind Ihre Lohnvorstellungen?` and to answer with a range in annual gross
  CHF.
- **Benchmark before answering.** Swiss sources for `salary_lookup.py` are listed in
  `tools/README_SALARY_TOOL.md`. Do not quote a figure the data does not support.
- **Pensionskasse (2nd pillar, BVG)** is real compensation. Employer contribution rates
  vary widely and are negotiable at senior levels; the legal minimum is a floor, not a
  norm. The three pillars are AHV (state), BVG (occupational), and 3a (private).
- **Canton changes take-home materially.** Income tax varies enough between cantons
  — Zug and Schwyz at one end, Geneva and Vaud at the other — that a nominally larger
  gross can be the smaller net. Flag this when comparing offers across cantons, and never
  present a gross comparison as if it were a net one.

---

## 6. Notice periods and start dates

Statutory defaults under **OR Art. 335b/335c**, all to the end of a calendar month:

| Period | Notice |
|---|---|
| During Probezeit | 7 days, any day |
| Year 1, after probation | 1 month |
| Years 2–9 | 2 months |
| Year 10 onward | 3 months |

Probation is the **first month** by default and may be extended to a maximum of three.
Contracts routinely lengthen the post-probation periods, and a CBA (GAV) may set its own —
so read the user's actual contract before stating a leaving date.

Practical effect: a posting saying `per sofort` (immediately) is often incompatible with a
candidate serving three months. Where the posting says `nach Vereinbarung` (by agreement),
the notice period is not an obstacle and should not be treated as one. State the earliest
realistic start date in the cover letter when the posting asks for it.

---

## 7. Language

**Which language to apply in:** the language the posting is written in. A German posting
gets a German dossier even from a fluent English speaker. Applying in English to a German
posting reads as an inability to work in the team's language.

**Swiss High German, not German German:**

- **`ß` does not exist in Swiss orthography. Ever.** Always `ss`: `Strasse`, `Grüsse`,
  `gross`, `Fussball`. A single `ß` marks the document as not locally produced. This is
  the most frequent tell in an otherwise good application.
- Helvetisms are correct here, not errors: `Praktikum`/`Stage`, `Lehre`/`Ausbildung`,
  `Pensum`, `Lohn` (more usual than `Gehalt`), `parkieren`, `Traktandum`.
- Sign-off: `Freundliche Grüsse` is the Swiss standard; `Mit freundlichen Grüßen` is
  German-German and doubly wrong for the `ß`.

**Register:** `Sie` in all written applications by default. Some tech employers and
startups use `Du` publicly — mirror the posting only when it is unambiguous.

**Salutation:** find the named contact. Swiss postings usually name one
(`Für Fragen steht Ihnen … zur Verfügung`), and using the name rather than
`Sehr geehrte Damen und Herren` is a visible mark of effort.

**Regions:** German-speaking (Zürich, Bern, Basel, and the East and Central regions),
French-speaking Romandie (Geneva, Lausanne, Neuchâtel, Jura, and Valais in part), Italian
Ticino. Bern and Fribourg/Valais are bilingual in practice.

**Language requirements in postings** are graded by the Language Gate in
`04-job-evaluation.md`. In this market they are usually genuine job conditions rather than
boilerplate: `Deutsch als Muttersprache` for a client-facing SME role, or a stated `C1`,
is normally a real bar. `Deutsch von Vorteil` is not.

---

## 8. Contacting the employer

Calling before applying is **normal and well received** in Switzerland, not pushy. Postings
routinely name a contact person and phone number precisely for this. A short, specific call
— one real question about the role, not "do you have my application" — measurably helps at
SMEs and in the public sector.

It carries much less weight at large international employers with centralised recruiting
and portal-only intake. `04-job-evaluation.md` decides whether to suggest a call; this is
the market context for that call.

---

## 9. Evaluating a Swiss posting

Additions to the standard fit framework. These sit alongside the dimensions in
`04-job-evaluation.md`, and none of them replaces one.

- **Pensum** matches what the user wants, and a range has been read as negotiable.
- **Language** requirement graded honestly by the Language Gate. In this market, treat a
  stated level as real unless hedged.
- **Canton** — commute measured in SBB travel time rather than kilometres, and the tax
  effect noted where an offer comparison spans cantons.
- **Employer type** — Swiss-domestic or international, since it sets the application
  language and the register.
- **13th month and Pensionskasse terms** flagged as questions for interview when the
  posting is silent, which it usually is.

> **Work authorisation.** The permit gate is **off** for this profile: the user is a Swiss
> citizen or holds a C permit, so no posting is filtered or downscored on permit grounds.
> A posting demanding a specific permit is not a deal-breaker here and should not be
> flagged as one. If that ever changes, this is the paragraph to rewrite.
