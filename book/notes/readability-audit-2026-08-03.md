# Readability and Structural Audit — 2026-08-03

Mechanical audit of `book/chapters/*.md` (the canonical source per `source-review.md`). Every
number here was measured, not estimated. Nothing in this file is prose for the manuscript.

## Headline: the manuscript is two books wearing one cover

Beat compliance is measured against the seven-part rhythm in `STYLE-AND-INTENT.md`
(opening scenario, big idea, methodology comparison, counterintuitive insight, takeaway,
closing scenario, reflection questions).

| Ch | Words | Beats | Reading |
| --- | --- | --- | --- |
| 00 | 901 | 0/7 | introduction |
| 01 | 3,362 | 3/7 | substantial, loosely structured |
| 02 | 2,285 | 2/7 | substantial, loosely structured |
| 03 | 2,887 | 3/7 | substantial, loosely structured |
| 04 | **8,118** | 1/7 | the deep one — 25% of the whole book |
| 05 | 6,911 | 3/7 | substantial |
| 06 | **627** | **7/7** | every beat, almost no content |
| 07 | 1,729 | 7/7 | every beat, thin |
| 08 | 958 | 7/7 | every beat, thin |
| 09 | 733 | 7/7 | every beat, thin |
| 10 | **557** | **7/7** | every beat, thinnest chapter in the book |
| 11 | 844 | 7/7 | every beat, thin |
| 12 | 1,009 | 3/7 | thin and unstructured |
| 13 | 1,097 | 0/7 | epilogue |

**Total: 32,018 words.** Chapters 01-05 hold **23,563** of them (74%). Chapters 06-12 hold
**6,457** (20%).

**The correlation is inverse and nearly perfect: the more completely a chapter satisfies the
required rhythm, the less it actually says.** Chapters 06-11 score 7/7 on structure and average
just 908 words. Chapters 01-05 score 1-3 out of 7 and average 4,713 words.

That is the signature of two different production methods. Chapters 01-05 read as written —
long, uneven, digressive, occasionally brilliant. Chapters 06-11 read as generated to the
template in `STYLE-AND-INTENT.md`: they hit every mandated beat in order and stop. They *look*
finished, which is the problem. A 557-word chapter with all seven beats present will pass a
structural checklist and fail a reader.

The existing `editorial-feedback.md` independently reached the compatible conclusion —
"Chapters 1-4 currently form the strongest progression", "Chapter 4 is the most operationally
convincing", "Chapter 6 is currently much shorter." This audit quantifies it.

### Length context

32,018 words is roughly half a trade business book (commonly 50,000-70,000). The imbalance
matters more than the total: Chapter 04 alone is 14× Chapter 10.

## Finding 1 — No chapter has a single markdown subheading

Measured: all 14 chapters contain exactly **one** `#` heading and **zero** `##`/`###` headings.

Every section label — `Opening Scenario:`, `Big Idea:`, `Comparing Methodologies:`,
`Counterintuitive Insight:`, `Takeaway Insight:`, `Closing Scenario:`, `Reflection Questions` —
is a **bare paragraph line**. Consequences:

- No table of contents can be generated from the source.
- No section anchors exist, so the review app and any web build cannot deep-link.
- In a compiled EPUB/PDF, these lines render as body paragraphs. The reader loses the
  scaffolding entirely — the rhythm the style guide mandates is invisible in the artifact.
- Bulleted content in several chapters (notably 10 and 11) is written as consecutive
  paragraphs with no `-` markers, so it does not render as lists either.

**This is the single highest-leverage readability fix available and it requires no new prose.**
Promoting the seven rhythm labels to `##` across 14 files is mechanical and reversible.

## Finding 2 — Section labels are inconsistent, which blocks automation

Variants counted across chapters:

| Canonical intent | Variants found |
| --- | --- |
| Big idea | `Big Idea` (5), `The Big Idea` (2), `Big Question` (1) |
| Takeaway | `Takeaway Insight` (6), `Key Takeaways` (1), `Key Takeaways for Letting Go` (1), `Takeaway` (1) |
| Reflection | `Reflection Questions` (7), `...for the Reader` (1), `...for Chapter 2/3/7` (3) |
| Methodology | `Comparing Methodologies` (8) |

Chapter-numbered reflection headings (`Reflection Questions for Chapter 7`) will break if
chapters are ever reordered or merged — and the editorial backlog already proposes merging 10
and 11.

## Finding 3 — Chapters 10 and 11 are near-duplicates, confirming the existing backlog item

Both contain, in the same order: an opening scenario, a "Big Idea" asserting AI augments rather
than replaces (`AI as a Partner, Not a Replacement` / `AI as an Enhancer, Not a Replacement`), a
methodology walk through Lean / Agile / ITIL, and a counterintuitive insight that automation
does not equal efficiency.

Recommendation, on the evidence: **keep Chapter 10's opening and merge.** Chapter 10 opens on
`The Auto-Generated Performance Review` — a manager sees his best problem-solver scored low by
an AI HR system because she absorbed a crisis. That is concrete, human, and lands the book's
thesis in one scene. Chapter 11 opens on an unnamed CIO who "struggl[es] to explain why their
recent AI integration hasn't delivered the efficiency gains promised" — an abstraction, and the
kind of keynote framing `STYLE-AND-INTENT.md` explicitly rules out.

Combined, they total 1,401 words — still under half the length of a normal chapter, which is the
real signal about how much of the AI argument is currently written.

## Finding 4 — Corrected: Deming's name was wrong in the introduction

`chapters/00-introduction.md` read **"Edward Deming's 14 Points"**. His name is
**W. Edwards Deming**. The error appeared at the book's first mention of the thinker who is its
central throughline, and had propagated into both files under `build/`.

Corrected 2026-08-03 in `chapters/`, `drafts/chapters/`, and both `build/` outputs. The other
five occurrences across the manuscript were already correct, which is why this one survived —
it was the outlier, not the pattern.

## Finding 5 — One attribution to re-check before publication

The introduction attributes to Deming the phrase *"quality is everyone's responsibility."*

Deming's actual and repeated emphasis runs the other way: that the overwhelming majority of
quality problems originate in the **system**, which is **management's** responsibility, and that
exhorting individual workers to care more is a category error. Point 3 of the 14 Points
("Cease dependence on inspection") and his objection to slogans and targets both push against
the everyone-is-responsible framing.

As written, the line risks asserting the opposite of the book's own Chapter 02 thesis
("management owns the process"). Flagging rather than editing, because the fix is authorial: it
may simply need to become *"quality is management's responsibility — and everyone's
concern,"* or be replaced with a sourced quotation.

## Recommended order of work

1. **Promote section labels to `##`** across all 14 chapters, normalising the variants in
   Finding 2 at the same time. Mechanical, no new prose, unlocks TOC and anchors.
2. **Merge 10 into 11 (or vice versa), keeping Chapter 10's opening scene.** Already in the
   backlog; this audit adds the evidence.
3. **Resolve Finding 5's attribution.**
4. **Address the 6,457-word problem in chapters 06-12.** This is the real work, and no
   structural pass substitutes for it. See `evidence/` for grounded material gathered from the
   author's own delivery systems that can carry these chapters — particularly the measurement
   appendix the editorial backlog has been asking for.
