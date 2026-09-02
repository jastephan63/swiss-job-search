---
framework_version: 1.1.1
---

# Candidate Profile

> **Single source of truth: `CLAUDE.md` at the repo root.**
>
> Identity, languages, education, full role history, technical skills, publications,
> references, the four tracks, deal-breakers, and the house style all live there and are
> maintained there. This file deliberately does **not** restate them - two copies of a CV
> drift, and a drifted profile is worse than one file to read.
>
> Read `CLAUDE.md` first. This file holds only the drafting material that has no natural
> home there.

## Drafting baselines

The real CVs, current as of 29 Aug 2026, live in `documents/cv/`. Start from the one whose
track matches the posting rather than writing from scratch:

| File | Track | Language |
|---|---|---|
| `current_en_developer-datascience.tex` | Developer / data science | English |
| `current_de_qualitative-research.tex` | Qualitative social research / spatial policy | German |
| `archive_2025-07_master.pdf` | Superseded. Only record of the Universität Zürich role | German |

Further tailored variants, four tracks across ~50 applications, are in
`~/Documents/Applications/`. `LUSTAT/Stephan_CV.tex` is the fullest German data-science CV;
`Bain/Stephan_CV.tex` is the single-page consulting version; `YouGov 4/Stephan_CV.tex` is
the survey-operations version.

## Signature evidence

Reuse these rather than inventing new framings. Each is verified and each carries a
specific, checkable detail.

**The Zurich Airport anomaly** (Interface, Flughafen Zürich AG). Owned the data workstream
on the annual passenger study: ~100,000 in-person interviews over two weeks. One transport
mode had apparently doubled year on year. Rather than logging it as a data error, ranked
every candidate explanation by likelihood and eliminated them in order - interviewer
effects, coding and digitisation errors, sample composition, signage, construction,
passenger routing. None held. Went looking for independent evidence and found the airport's
escalators had automated passenger counters, a dataset nobody on the team knew existed.
They confirmed the volume was real; SBB rolling-stock and timetable data explained why -
higher-capacity trains, not added frequency. Fed into multimodal planning and
infrastructure prioritisation.
*Use for:* hypothesis-led reasoning, data validation, initiative, consulting track.

**The 300 planning documents** (ETH Zürich, SPUR). Systematic content analysis of ~300
regional planning and policy documents; qualitative coding in MAXQDA and a typology of
urban sustainability policy. Same programme produced survey experiments across eight
European cities in eight languages and the *Nature Sustainability* co-authorship on the gap
between promised and actual citizen participation.
*Use for:* qualitative method depth, scale, research track.

**Smart City Zürich** (Sotomo). Led the study of the City of Zürich's digital services:
access, use, and barriers across neighbourhoods, 10,000+ residents. Coordinated with
administration, politics, and research; wrote the reports and policy briefs.
*Use for:* end-to-end client ownership, digital government, public-sector track.

**The internal R packages** (Sotomo). Developed, documented, and maintained the weighting,
automated-reporting, and visualisation packages the team adopted as its standard analysis
infrastructure, replacing code rewritten project by project.
*Use for:* the "builds tools, not just uses them" claim - but pair it with `polyviz`
(below), because an employer cannot inspect an internal package.

**`polyviz`** (github.com/jastephan63/polyviz). Public R package, v0.7.0, MIT. 25 D3 v7
chart types driven from a pure R interface; polyglot backend spanning JavaScript, SQL,
Python (with a pure-R fallback), and SAS. 28 testthat files, R-CMD-check CI, 4 vignettes,
pkgdown gallery on Swiss open government data.
*Use for:* every developer-track application. This is the inspectable proof of the R
package development claim, and it currently appears on none of the CVs.

**`chsearch`** (github.com/jastephan63/swiss-opendata-semantic-search). Python package,
MIT. German semantic search over Swiss open government metadata with a full retrieval
evaluation: TF-IDF vs multilingual sentence embeddings vs hybrid, scored on Recall@k, MRR
and nDCG@10 over 558 opendata.swiss descriptions. Lexical beats neural by 25% relative
nDCG, reported as the headline finding rather than buried. A seeded robustness suite
measures degradation under eszett, umlaut-transliteration, typo and truncation
perturbations. 42 offline tests, CI on 3.10-3.12.
*Use for:* any posting asking for Python ML/NLP code samples, model evaluation, or
evidence of judgement about when not to use a neural model. Built 2026-09-02.

**`citygov`** (github.com/jastephan63/citygov). SQLite compliance databank of ~400 Kanton
Schaffhausen Formulare, ~10,400 atomic data points, 74% mapped to eCH e-government
standards with 25 draft eSH standards covering the rest.
*Use for:* digital-government and public-sector data roles.

## Master's thesis

*Regulatory Repercussions: The Effects of Local Short-Term Rental Regulations on Housing
Costs* (ETH Zürich, 2024). Mixed methods: qualitative coding of 146 regulatory documents
from 133 US cities, plus a difference-in-differences estimate of the effect on housing
costs. Code at github.com/jastephan63/str-regulation-housing.
*Use for:* housing and real-estate policy roles (IAZI, Wüest und Partner), causal-inference
claims, and the tourism/short-term-rental thread.

## Known inconsistencies to resolve

Carried forward from the prior applications - fix once, then apply everywhere:

- **Sotomo end date.** Dec 2025 on most CVs, Jan 2026 on the cynkra CV, Nov 2025 on the
  2025 master. `CLAUDE.md` uses **Dec 2025**. Confirm against the Arbeitszeugnis.
- **Sotomo seniority.** Labelled `(Praktikum)` on the YouGov 2 CV only, a full research
  associate role on all others. `CLAUDE.md` uses the **full role**. Do not reintroduce the
  internship framing unless it is factually correct.
- **A placeholder once reached a compiled PDF.** `cynkra/Stephan_CV.pdf` shipped with
  `[ADD: one Shiny application, what it did and who used it.]` visible in the Sotomo
  bullets. The Verification Checklist in `CLAUDE.md` now checks for this explicitly.
