# Editorial Feedback

This file captures feedback that has not yet been incorporated into the manuscript prose.

🔴 **READ THIS BEFORE EXECUTING ANY ITEM BELOW.** Verified 2026-08-04: the manuscript prose currently
contains **no folklore statistics — because it contains no statistics at all.** Every numeric claim in
all 14 canonical chapter files sits in Chapter 10, added 2026-08-04 from primary sources.

**That means the risk in this file is prospective, not historical.** Nothing here has damaged the book
yet. But **two items below instruct a writer to add claims that are false or undefined**, and executing
them as written would introduce the first citation defects into a manuscript that currently has none.
Both are flagged inline with ⚠. Cross-check every metric named here against
`book/notes/evidence/citations-and-corrections.md` before drafting it.

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
- ⚠ **MTTR — do NOT introduce this as an ITIL metric.** It is not one. Verified: zero occurrences in
  the official AXELOS incident-management guidance. See evidence bank §1.8. The useful move is the
  opposite of what this line implies: **upgrading MTTR to a P85 service level is *more* ITIL-aligned,
  not less**, and saying so is one of the strongest ITIL findings available to this book.
- ⚠ **change success rate — real, but a trap.** It *is* an official ITIL 4 metric, and ITIL 4 **never
  defines it**. See §4.5. Do not print a formula and imply ITIL supplied it; the honest version is to
  name the gap.
- service availability — safe. Use the nines table (§3.4, computed and cross-validated) and the SRE
  point that availability should be *"reliable enough, but no more reliable than it needs to be"* (§6).

### Chapters 10 and 11 — 🔴 DO NOT MERGE. This item was written against the wrong files.

**Retracted 2026-08-04, same day it was actioned.** An earlier pass this session concluded the overlap
was total and merged Chapter 11 into Chapter 10. **That conclusion was measured on `book/chapters/`,
and it was wrong.** In `book/drafts/chapters/` — the copy the build actually prefers — the two chapters
are already sharply distinct and both are real prose:

- `drafts/chapters/10-*.md` (**1,987 words**) — "AI Changes the Bottleneck, Not the Need for Human
  Judgment." Opens on *The Quarter Everyone Claimed AI Was Helping*: teams "not drowning in manual
  effort… drowning in review."
- `drafts/chapters/11-*.md` (**2,025 words**) — "The Next Step Is Not a New Religion. It Is a Better
  Operating Posture." Covers method synthesis across Lean/Agile/ITIL/**PMBOK/BABOK**, "The New
  Lifecycle of Work," "Roles Are Shifting, But Responsibility Is Not Disappearing," and "Where Weak
  Leadership Shows Up." Carries a *"what it misses when used alone"* comparison for each method — which
  is exactly the methodology-handling rule in `STYLE-AND-INTENT.md`.

**The original feedback item was itself derived from the thin `chapters/` copies**, where the two files
really did argue "AI as a Partner, Not a Replacement" and "AI as an Enhancer, Not a Replacement." The
overlap was an artifact of reading the abandoned track. **The answer to "merge or sharply separate" is:
they are already separated. Neither file should be deleted.**

🔴 **The actual defect this exposed — and it is the top-priority issue in this repo.** See the new
`## TRACK DIVERGENCE` section at the bottom of this file.

### Chapter 12

- Turn named learning metrics into defined formulas.

## Measurement Backlog

The feedback suggests a future measurement appendix or chapter covering:

- rework rate — ★ **the author already has a real operationalization of this**: reopened work earns
  **zero**, not negative. That satisfies Major Gap 4 and the Chapter 1 editorial note with measured
  practice rather than a borrowed formula. See `evidence/conduit-measured-evidence.md`.
- sprint predictability
- cycle time percentiles — ★ backed by the author's own measured data: median cycle time **6.76 → 2.64
  days after the July restructure, n = 110**. ⚠ But apply §3.2's own caveat: P85 needs **~100
  observations** for a tight two-sided interval; at n≈20 the real 95% CI spans the 65th percentile to
  the sample maximum. The book cannot preach percentile discipline and then under-power its own.
- workload balance
- handoff lag
- bug density
- ⚠ **flow efficiency — the metric is fine; the benchmark is folklore.** The commonly repeated
  "typically 5–15%" has no traceable source (§1.9). Define the ratio if useful, but **do not print a
  typical range** as though it were an established finding.
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

---

## 🔴 TRACK DIVERGENCE — the highest-priority issue in this repository

**Discovered 2026-08-04.** There are two full copies of every chapter and they disagree, in the
direction nobody expected.

| | `book/chapters/` | `book/drafts/chapters/` |
| --- | --- | --- |
| Words (before this session's edits) | **32,177** | **41,166** |
| Last commit touching it | `e19ca41`, **2026-08-04** | `7910447`, **2026-06-21** |
| What that commit did | mechanical only — heading promotion, Deming name fix | *"Revise draft chapters and methodology planning"* |
| Status per `notes/source-review.md` | "canonical manuscript source" | "archived support material" |
| Status per `book/README.md` | "the stable build/source copy" | "the editable review copy"; **"Builds prefer the draft copy when it exists"** |

**`drafts/` is roughly 9,000 words AHEAD of canonical.** The June 21 pass wrote substantial real prose
into the draft track and it was **never promoted into `chapters/`**. Per-file, the draft copy is longer
in **13 of 14 files** — Chapter 6 by 3.8× (713 → 2,689), Chapter 9 by 2.4×, Chapter 8 by 1.9×.

### 🔴 What this invalidates

**The "manuscript is two books / chapters 6-13 are template-generated scaffolding" diagnosis was
measured on `book/chapters/` and does not hold for the draft track.** Spot-checked: `drafts/06` opens on
a genuine written scene — an 8:17 a.m. outage, a support channel "like a family group text after
somebody accidentally hit 'reply all' on a controversial meme," an engineer muttering *"We've automated
the confusion."* That is not scaffolding. It is the book's voice.

⚠ **This is a measurement error of exactly the kind Chapter 10 is about.** A word count was taken, it
was accurate, and it answered a narrower question than the one being asked — "how long are the files in
this directory," not "how much of this book is written." Two chapter-quality conclusions and one merge
were built on it. **Verify which track you are reading before drawing any conclusion about this
manuscript.**

### 🔴 Second-order defect: validation never runs on the live manuscript

`validate_chapter_file()` is called only on the paths in `config/book.json` — i.e. **`chapters/` only**.
`drafts/chapters/` is never validated. Consequences, both currently live:

- **7 of the 8 visual asset ids referenced in `drafts/` are unregistered.** Referenced:
  `audience-impact-matrix`, `bottleneck-shift-map`, `framework-map-ai-era`, `governance-upstream`,
  `hidden-costs-of-rework`, `role-shift-map`, `terminology-crosswalk`, `work-lifecycle-map`.
  Registered in `config/assets.json`: **`hidden-costs-of-rework` alone.** Validation reports
  "unresolved visual asset" for each unregistered id — so **promoting drafts to `chapters/` today would
  fail validation seven times.** Nobody has seen those errors because the files they live in are not
  checked.
- The clean `validate` result reported all session is therefore **narrower than it appears**: it
  certifies the stale copy. Same defect class as everything else in this section.

**Fix:** either point validation at both tracks, or register the seven assets (with an explicit
`status` such as `proposed`) before any promotion. Note the existing entry carries
`"status": "ready"` and a real `source_path`, so `proposed` entries need a status the renderer tolerates.

⚠ **Figure *ideas* added 2026-08-04 deliberately use `EDITORIAL_NOTE (FIGURE IDEA)` and NOT the
`VISUAL:` form**, precisely so they add no validation debt. Do not convert them to `VISUAL:` directives
until the asset is real and registered.

### Consequences to resolve, in order

1. **Do not merge or delete Chapters 10 and 11.** See that section above — retracted.
2. **`chapters/10-*.md` was rewritten this session on the wrong base.** It is 3,736 words of
   evidence-bearing prose built out from the abandoned 572-word template, and it therefore uses the
   Mark/Lisa performance-review opening. `drafts/10` uses a **different and stronger** opening (*The
   Quarter Everyone Claimed AI Was Helping*) and a different spine. The evidence added — METR, both
   DORA findings, the author's own data — is sound and worth keeping; **the frame it was poured into is
   the discarded one.** Reconcile deliberately, do not just pick a longer file.
3. **Decide which track is canonical and make the tooling say so.** `source-review.md` and `README.md`
   currently contradict each other, and `build_book.py` sides with the README:
   `draft_chapter_paths_from_config()` prefers `drafts/` per-file and emits
   `build/Lean-and-Agile-draft.md`, while `chapter_paths_from_config()` emits
   `build/Lean-and-Agile.md`. Two build artifacts, two manuscripts, no stated winner.
4. **Only then** re-audit chapter thinness. The real thin-chapter list is unknown until it is measured
   on whichever track wins — and the June work may already have closed several of the "Major Gaps"
   listed at the top of this file.
