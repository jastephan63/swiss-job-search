# Swiss Market Conventions

Rules that apply to applications in Switzerland and nowhere else in this framework. Read
this before evaluating a Swiss posting (Step 1), before assembling a dossier (Steps 2–3),
and before interview prep (Step 4).

Where a convention differs by language region or by employer type, that is stated. The
biggest single split is **Swiss-domestic employers** (SMEs, cantonal and federal
administration, healthcare, trades, insurance) versus **international employers**
(pharma in Basel, banks and big tech in Zürich, EPFL/ETH, CERN, commodity trading in
Geneva/Zug). The first group expects a Swiss dossier in the local language. The second
often runs entirely in English on Anglo-American norms. Applying the wrong set of
conventions is a visible mistake in both directions.

---

## 1. The dossier

A Swiss application is a **Bewerbungsdossier**, not a CV plus cover letter. Unless the
posting or portal says otherwise, deliver **one PDF** containing, in this order:

1. **Motivationsschreiben** (cover letter) — 1 page
2. **Lebenslauf** (CV) — 2 pages, 3 only for senior or academic profiles
3. **Arbeitszeugnisse** — full copies, most recent first
4. **Diplome** — degree certificates, plus transcripts where relevant
5. **Weiterbildungen / Zertifikate** — only those relevant to the posting

Items 3–5 are what makes this a dossier. Omitting Arbeitszeugnisse from a Swiss-domestic
application is not a minor omission — it is the most common reason a Swiss recruiter treats
an application as incomplete, because the Zeugnis is the primary evidence instrument in
this market (see §3).

International employers and most online portals want CV + cover letter only, with
certificates on request. Follow the posting.

> **Framework note.** `/apply` produces items 1 and 2. Items 3–5 are the user's own files
> in `documents/diplomas/` and `documents/references/`. When the target is a
> Swiss-domestic employer, say so explicitly in the final output: name which documents the
> user must append before sending, and do not describe the application as ready to submit
> when a dossier is expected and the references are missing.

---

## 2. Photo on the CV

**Include one** for Swiss-domestic employers, especially in German-speaking Switzerland.
It remains the default expectation, and its absence reads as an incomplete CV rather than
as a principled stance.

- Professional headshot, neutral background, business attire matched to the sector
- Top of page 1, typically upper right
- Never a cropped holiday photo

**Omit it** for international employers running Anglo-American processes, for anything
routed through a US or UK parent company's ATS, and wherever the posting says not to send
one. Some large Swiss employers now explicitly request no photo to support anonymised
screening — follow that instruction when given.

This is the opposite of US and UK convention. When in doubt for a mixed employer, the
photo is the lower-risk choice in the German-speaking market and the higher-risk choice
in an English-language international process.

---

## 3. Arbeitszeugnis — the reference certificate

The single most Switzerland-specific element, and the one with no equivalent in the Danish
or Anglo-American frameworks.

Under **OR Art. 330a**, an employee may demand a written reference from every employer
covering the nature and duration of employment, performance, and conduct. Case law
requires it to be simultaneously **truthful** and **benevolent**. Those two duties
conflict, and the profession resolved the conflict by developing a **coded language**: a
Zeugnis is superficially positive throughout, and the actual grade is carried by precise
formula choice.

### The grading scale

Swiss Zeugnisse map to the **Swiss school scale of 1–6, where 6 is the best** — the
inverse of the German 1–6 scale. Two levers set the grade:

- **Intensity**: `vollsten` > `vollen` > no qualifier
- **Time component**: `stets` / `jederzeit` means continuously; its *absence* drops the
  rating by roughly one grade

| Formula | Grade | Reads as |
|---|---|---|
| `stets zur vollsten Zufriedenheit` | 6 | Excellent |
| `zur vollsten Zufriedenheit` | 5–6 | Very good |
| `stets zur vollen Zufriedenheit` | 5 | Very good |
| `zur vollen Zufriedenheit` | 4 | Good |
| `stets zur Zufriedenheit` | 3–4 | Satisfactory |
| `zur Zufriedenheit` | 3 | Sufficient — a weak reference |
| `im Grossen und Ganzen zur Zufriedenheit` | 2 | Poor |
| `hat sich bemüht` / `war stets bemüht` | 1 | Failing. Effort without result |

### Other signals

- **The closing matters.** A full ending thanks the employee, expresses regret at the
  departure, and wishes them well. A bare `Wir wünschen ihm für die Zukunft alles Gute`
  with no thanks and no regret is a deliberate cold ending.
- **Reason for leaving.** `auf eigenen Wunsch` (own request) is neutral-positive. Silence
  where a reason would be expected invites the reader to assume the worst.
- **Arbeitsbestätigung vs Arbeitszeugnis.** A bare *Arbeitsbestätigung* confirms only
  dates and role. Supplying one where a qualified *Arbeitszeugnis* is expected signals a
  problem, so never substitute one silently.
- **Zwischenzeugnis** is an interim reference from an ongoing role — the correct document
  when the user is still employed and cannot yet ask for a final one.
- **Conduct clause.** Behaviour toward superiors, colleagues, and clients is graded
  separately, and the *order* is meaningful. Colleagues listed before superiors, or
  superiors omitted, is a recognised negative marker.

### How this framework uses it

**Reading the user's own Zeugnisse** (during `/setup` Path A, from
`documents/references/`): grade each one and use the result to calibrate, never to
inflate. A Grade 6 Zeugnis is hard evidence for a CV claim. A Grade 3 is a reason to
frame that role modestly rather than as a highlight.

**Never** paraphrase a Zeugnis into a CV or cover letter claim that outruns its grade. A
recruiter reading the dossier has the Zeugnis on page 4 and will see the contradiction —
which is worse than a modest claim.

**Flagging gaps.** If the user has no Zeugnis for a role on their CV, raise it before the
dossier goes out. For a current employer, a Zwischenzeugnis is the fix. For a past
employer, OR 330a entitles them to request one retroactively.

---

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
- **Employer type** — Swiss-domestic or international, since it determines dossier
  contents, photo, and application language. This is the first thing to establish about a
  Swiss posting, because three other decisions follow from it.
- **13th month and Pensionskasse terms** flagged as questions for interview when the
  posting is silent, which it usually is.
- **Zeugnis coverage** — whether the user actually holds references for the roles this
  application leans on.

> **Work authorisation.** The permit gate is **off** for this profile: the user is a Swiss
> citizen or holds a C permit, so no posting is filtered or downscored on permit grounds.
> A posting demanding a specific permit is not a deal-breaker here and should not be
> flagged as one. If that ever changes, this is the paragraph to rewrite.
