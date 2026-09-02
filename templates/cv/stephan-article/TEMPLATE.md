# Template: stephan-article (CV)

**Type:** CV
**Source extension:** `.tex`
**Compile command:** `pdflatex -interaction=nonstopmode <file>.tex` (run **twice**)
**Engine/toolchain:** pdflatex (TinyTeX, TeX Live 2022)
**Page limit:** 2 full pages for Swiss employers (cantonal, federal, research, SME). 1 page for management consulting only. Never a partial page.

## Files

| File | Use |
|---|---|
| `template.tex` | English. Bold section headings, `\cventry{title}{org}{dates}` with bold title. |
| `template-de.tex` | German. Non-bold headings, lighter weight, `\cventry` puts org inline. |

## Fonts

Latin Modern (`lmodern`) with `microtype`, T1 encoding. No external font files, no
`fontspec`, no XeTeX/LuaTeX requirement. Accent colour `cvblue` = `HTML{2E5A8C}`.

## Required packages

`fontenc` (T1), `inputenc` (utf8), `lmodern`, `microtype`, `geometry`, `xcolor`,
`enumitem`, `hyperref`; `tabularx` (German variant); `babel` with `ngerman` (German) or
`english` (English).

Installed into TinyTeX for this machine via:
`tlmgr install microtype babel-german hyphen-german babel-english hyphen-english enumitem tabularx xcolor lm ec`

TinyTeX here is TeX Live **2022**, so `tlmgr` must point at the matching historic repo:
`tlmgr option repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2022/tlnet-final`

## Style rules (non-negotiable)

- **No em-dashes.** Normal hyphens in compounds only.
- **No `ß`.** Swiss orthography throughout: `Strasse`, `Grüsse`, `gross`.
- **Single column, no graphics, no photo.** ATS-safe by construction.
- Bold used sparingly in the CV only, never in cover letters.
- Keep the `%%` header comment block naming the target employer, role, and the style rules
  in force. Every prior application carries one.

## Structure

`\cvsection{...}` for section headings (coloured rule underneath).
`\cventry{Role}{Organisation}{Dates}` followed by an `itemize` block.
Header: name, coloured one-line positioning statement, then a `\textbullet`-separated
contact line.

The positioning line under the name is the **track selector** and must be rewritten per
application, e.g. `R and Python developer for data products in the public sector`
(developer) vs `Qualitative Sozialforschung, Stadt- und Raumentwicklung, Landnutzung`
(research).

## Placeholders

`[FULL_NAME]`, `[EMAIL]`, `[PHONE]`, `[LINKEDIN]`, `[LINKEDIN_URL]` — substitute from
`CLAUDE.md`.

## Verified

Both variants compile clean with `pdflatex` (2 passes), 1 page each. Text layer extracts
with email and phone as literal text and no `(cid:` artifacts. Verified 2026-09-02.

**Note:** hyperref writes `<jobname>.out`. Never redirect compiler output to that filename
— it clobbers the bookmark file and the next run dies with `Missing { inserted`.

## Placeholder traps (both hit during registration)

1. **No `_` inside a placeholder token.** `_` is a math-mode character. `[FULL_NAME]` silently
   threw the document into math mode and turned a 1-page CV into 5 pages with **no LaTeX
   error**. Use `[First] [Last]`, `[LinkedInURL]` — never underscores. This is why upstream's
   own `cv/main_example.tex` uses `\name{[First]}{[Last]}`.
2. **Brace a line-initial placeholder that follows a bare `\\`.** LaTeX reads `\\` + `[...]`
   as `\\` with an optional vertical-space argument, so an address block like
   `Zürich\\` / `[Phone]` fails with "Missing number, treated as zero". Write `{[Phone]}`.
   The CV escapes this only because its `\\` already carries an explicit `[0.5em]`.

Both produce broken output that a `.tex` read cannot catch. Compile and count pages.


## Never use `\enlargethispage` to force a page fit

It extends the text block past the bottom margin. Content then renders **below the page
boundary**: still in the text layer, still counted as one page, but not on the paper. Six
CVs shipped this way before it was caught by looking at a printout.

Check the lowest baseline on the last page, not the page count:

```
python3 -c "from pypdf import PdfReader; r=PdfReader('f.pdf'); ys=[]; \
r.pages[-1].extract_text(visitor_text=lambda t,cm,tm,fd,fs: ys.append(tm[5]) if t.strip() else None); print(min(ys))"
```

Below ~30pt is at or over the edge. If a document overflows, cut content or let it run to a
full second page.
