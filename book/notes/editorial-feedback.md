# Editorial Feedback

This file captures feedback that has not yet been incorporated into the manuscript prose.

## Source

Converted from `lean_agile_feedback.txt` and preserved separately so the manuscript can evolve intentionally rather than absorbing review notes blindly.

## Strengths

- The scenario-based storytelling is engaging and accessible.
- Deming is woven through the manuscript as a real throughline.
- Chapters 1-4 currently form the strongest progression.
- Chapter 4 is the most operationally convincing chapter.
- The hidden-factory framing in Chapter 1 is memorable.
- The manuscript is honest about the failure modes of each methodology.

## Major Gaps

1. Chapter 5 needs a concrete measurement section.
2. Metrics are concentrated too heavily in Chapter 4.
3. Chapter 6 is currently much shorter and needs a fuller worked example.
4. The hidden factory concept needs a measurable operational link.
5. The book would benefit from a clear measurement chapter or appendix.
6. Chapters 10 and 11 likely overlap enough to merit consolidation or sharper distinction.
7. Average-based metrics should often be upgraded to percentiles, especially P85.

## High-Value Chapter Improvements

### Chapter 1

- Connect the hidden factory concept to a measurable rework-rate formula.
- Consider a practical threshold or example, not just concept language.

### Chapter 4

- Extend Takt Time and Little's Law into software-delivery examples.
- Keep this chapter as a benchmark for how practical the rest of the book should feel.

### Chapter 5

Add a section such as "Measuring Agile Success" with formulas or examples for:

- velocity
- cycle time percentiles
- commitment accuracy
- lead time
- WIP guidance

### Chapter 6

Add:

- a worked ITIL scenario
- MTTR
- change success rate
- service availability

### Chapters 10 and 11

- Review for overlap.
- Decide whether to merge or more sharply separate "AI as tool" from "AI as risk and limitation."

### Chapter 12

- Turn named learning metrics into defined formulas.

## Measurement Backlog

The feedback suggests a future measurement appendix or chapter covering:

- rework rate
- sprint predictability
- cycle time percentiles
- workload balance
- handoff lag
- bug density
- flow efficiency
- value alignment

## Status Addendum (2026-07-26 measurement pass, drafts/chapters/)

Applied against the revised draft copies, not the stable `chapters/` copies:

- Major Gap 1 (Ch. 5 measurement section): **addressed** — "Measuring Agile Success (Without Weaponizing the Numbers)": velocity-as-planning-only, commitment accuracy with healthy bands, P85 cycle time vs. averages, lead-time/cycle-time gap as queue diagnosis, Little's Law tie-back to Ch. 4.
- Major Gap 3 (Ch. 6 worked example + ITIL metrics): **addressed** — "The Numbers That Tell the Truth": MTTR with detect/engage/restore segmentation, change success rate as upstream-context diagnostic, availability translated to hours-per-year, worked before/after example in Priya's scenario (figures illustrative pending real data — flagged in-file).
- Major Gap 4 (hidden factory → measurable link): **addressed** — Ch. 1 now defines rework rate with the 10-person/30%/3-FTE worked example and the Deming don't-weaponize rule.
- Ch. 12 learning metrics: **addressed** — "Giving Learning a Number": time to competence (ties to Ch. 10 ladder problem), repeat-issue rate, improvement adoption, skill coverage.
- Gap 6 (Ch. 10/11 overlap): **resolved by revision** — drafts now split as human-side (10) vs. operating-posture (11), with the jobs-misdiagnosis, induced-demand pattern, ladder problem, and reach/trust threads in 10 and the compressed-adjustment-cycle argument in 11. See `ai-era-logic-brief.md`.
- Gap 7 (percentiles over averages): **applied** in every new measurement passage (P85 in Ch. 5 and Ch. 6).
- Still open: Gap 2 (metrics concentrated in Ch. 4 — now partially diffused), Gap 5 (dedicated measurement appendix decision), and all citation/data EDITORIAL_NOTEs awaiting real-world evidence from the research emails.

## Usage Rule

Do not treat this file as manuscript prose. It is a tracked editorial backlog.
