# Template: stephan-letter (Cover letter)

**Type:** Cover letter
**Source extension:** `.tex`
**Compile command:** `pdflatex -interaction=nonstopmode <file>.tex` (run **twice**)
**Engine/toolchain:** pdflatex (TinyTeX, TeX Live 2022)
**Page limit:** exactly 1 page, signature block included.

## Files

| File | Use |
|---|---|
| `template.tex` | German (`Motivationsschreiben`). `babel` `ngerman`, 11pt. |
| `template-en.tex` | English. |

## Fonts

Latin Modern with `microtype`, T1. No `fontspec`, no XeTeX. Plain `article`, no custom class.

## Structure

`flushleft` sender block, `flushright` recipient block, place and date line, subject line,
salutation, four to five body paragraphs, `Freundliche Grüsse` / `Kind regards`, signature.

## Style rules (non-negotiable)

- **No em-dashes.**
- **No `ß`.** `Freundliche Grüsse`, never `Mit freundlichen Grüßen`.
- **No bold anywhere in the body.**
- Open with **one concrete story**, not a thesis statement. The Zurich Airport escalator
  finding and the 300 ETH planning documents are the two proven openers.
- Address the **named contact** where the posting gives one.
- Close by stating language, availability, and the Pensum applied for.

## Placeholders

`[FULL_NAME]`, `[EMAIL]`, `[PHONE]` — substitute from `CLAUDE.md`.

## Verified

Compiles clean with `pdflatex`, 1 page. Verified 2026-09-02.

## Placeholder traps

- **Brace line-initial placeholders.** The `flushleft` sender block ends each line with a
  bare `\\`, so `[Phone]` on the next line is swallowed as `\\`'s optional argument
  ("Missing number, treated as zero"). Stored as `{[Phone]}` for this reason.
- **No `_` in placeholder tokens** — `_` is a math-mode character and breaks layout silently.
