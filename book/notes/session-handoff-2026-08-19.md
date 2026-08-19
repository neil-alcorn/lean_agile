# Session Handoff — 2026-08-19

Not a Conduit-managed repo (no CONDUIT.md), so this is the plain-git equivalent of a
session-wrap: durable state for a fresh session to resume without replaying the chat.

## Summary

Full chapter-by-chapter reader-engagement review of the merged manuscript (see
`ai-era-logic-brief.md` for the merge that combined this session's AI/measurement work
with a second Claude session's Conduit-sourced evidence and heading-structure fixes).
Chapters 1-5 are done. Chapters 6-13 + epilogue remain.

## Decisions made

- **Balance/pacing**: the "manuscript is two books" audit finding (measured against the
  stale `chapters/` track) mostly self-resolved once both sessions' work merged into
  `drafts/chapters/` (32,018 -> 50,672+ words). Chapter 4's length/register is earned —
  read in full, verdict was mechanics-only fixes, no trim.
- **Deming misattribution**: "quality is everyone's job/responsibility" is a confirmed
  book-wide recurring bug in the original source material. Fixed in Ch1 and Ch2 (both
  reintroduced it independently). Check for it in every remaining chapter — see the
  grep command below.
- **Redundant chapter endings**: multiple chapters had recap/"Final Thoughts" sections
  sitting between the real closing scene and Reflection Questions, restating the
  chapter's point 3-5x. Fixed in Ch1 (5x restatement), Ch2 ("Final Reflection"), Ch3
  ("Final Thoughts"), Ch5 (FOUR separate "Final Thoughts" headers — the worst case).
  **Check every remaining chapter for this same pattern.**
- **List-rendering bug** (original audit's #1 mechanical finding): paragraph-run pseudo-
  lists ("Word: sentence." as standalone paragraphs, no `-` marker) render as disconnected
  body text, not lists, in any real build. Fixed extensively in Ch1, 2, 3, 4, 5. **Ch6-13
  have not been checked yet** — assume the bug is present until verified, since it was
  present in every untouched-by-either-session chapter so far.
- **Vendor-name-dropping**: trimmed/genericized in Ch1, Ch3, Ch5 (Ch5's "How AI Enhances
  Agile" was the worst offender in the book — cut ~1,200 words and pointed forward to
  Ch10/11's better-sourced AI argument instead of arguing the same case twice).
- **Bare numbered/unlabeled pseudo-headings** ("1. Defects: ..." as body text, not a
  heading): promoted to real `###` headings in Ch4 and Ch5. Check remaining chapters.

## Verification status (all passing as of last commit `30377ed`)

```bash
cd "C:\Users\nalco\GitRepos\lean_agile"
"C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" book/tools/build_book.py build
cat book/build/validation-report.txt          # should say "No validation issues detected."
"C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m pytest book/tests/test_build_book.py -q   # 4 passed
grep -rn "everyone.s responsibility\|everyone.s job" book/drafts/chapters/*.md   # should show ONLY 00-introduction.md (its deliberate setup)
grep -rl "^<<<<<<<\|^=======$\|^>>>>>>>" book/    # should be empty (no leftover merge conflicts)
```

## Files modified this session

All six commits below are local only — **not pushed to origin** (6 commits ahead of
`origin/main`; push was never requested, consistent with the repo's established
draft-review-before-promote workflow via the local review app).

```
30377ed Ch5 reader-engagement pass: fix four-way redundant ending, cut AI section
3387d6a Ch4 reader-engagement pass: mechanical list/heading fixes, no content trim
2fb8dd0 Ch3 reader-engagement pass + verification-catch fixes to Ch1/Ch2
1a5d2bf Ch2 reader-engagement pass: same Deming slogan slip, plus grammar and flow
d840731 Ch1 reader-engagement pass: fix Deming contradiction, cut repetition
db108ec Ch4: fix stray title fragment, resolve image TODO, clean reflection questions
```
(plus the earlier `2116b59` merge commit and prior figure/review-app work, already
covered in `ai-era-logic-brief.md` and `editorial-feedback.md`)

## Work remaining, in order

1. Chapter 6 (ITIL) — already got the measurement-section pass earlier; needs the
   same reader-engagement/list-bug/redundant-ending checks as 1-5.
2. Chapters 7, 8, 9 — untouched by either prior session, so expect the list-bug and
   bare-heading patterns to be present, same as Ch1-4 were.
3. Chapters 10, 11, 12 — already heavily revised (METR/DORA evidence, measurement
   sections) but not yet read with the dedicated "coherent narrative" lens this pass
   uses; check for the redundant-ending and list-bug patterns anyway.
4. Chapter 13 (Epilogue) and re-check chapter-to-chapter transitions once all are done.
5. After all chapters: revisit `book/notes/editorial-feedback.md`'s Gap 2 (metrics
   concentration) and Gap 5 (dedicated measurement appendix decision) — both were left
   open in the 2026-07-26 status addendum.
6. The two research emails sent to neil.alcorn@horacemann.com (round 1 and round 2,
   see prior session) never got a reply in Gmail as of last check — worth a nudge if
   real-world evidence is still wanted for the illustrative figures flagged with
   EDITORIAL_NOTE (Ch6's MTTR/change-success worked example, Ch10/11's capex claims).
7. Chapter 1's fishbone image (`hidden-costs-of-rework.png`) is the only pre-existing
   image in the book — stylistically inconsistent with the 8 figures built this
   project (hand-sketched vs. clean navy-accent geometric) and generic rather than
   tied to the specific rework-rate worked example now in the prose. Flagged, not
   yet replaced.

## Next action

Resume with Chapter 6: read in full, check against `STYLE-AND-INTENT.md`, fix the
Deming slogan / redundant-ending / list-bug patterns per the standard established in
Ch1-5, verify with the commands above, commit, then continue to Ch7.
