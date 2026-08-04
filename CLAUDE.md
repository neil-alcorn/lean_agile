# Lean and Agile — working rules

## 🔴 Rule 1: edit `book/drafts/chapters/`, never `book/chapters/`

There are two full copies of every chapter. They are not peers.

| | `book/drafts/chapters/` | `book/chapters/` |
| --- | --- | --- |
| Role | **the live manuscript — edit here** | downstream promoted copy |
| Hand-edit? | yes | **no — treat as generated** |
| Written by | the author, and the review app | promotion from drafts, after approval |

The author reviews and approves changes in the local review app, which writes into
`book/drafts/chapters/`. Work landed in `book/chapters/` is on the wrong track: it will not be reviewed,
and it will be overwritten or silently diverge.

⚠ **The directory name lies.** "drafts" is the book. `book/chapters/` is the stale one.

## 🔴 Rule 2: measure the drafts track, or your numbers will be wrong

On 2026-08-04 the tracks had drifted **~9,000 words apart**, `drafts/` ahead and longer in **13 of 14
files** (Chapter 6 by **3.8×** — 713 vs 2,689 words). A session measured `book/chapters/`, concluded the
back half of the book was "template-generated scaffolding," and merged two chapters on that basis. All of
it was wrong: in the drafts track those chapters are real prose and genuinely distinct.

The word count was *accurate*. It answered a narrower question than the one being asked — "how long are
the files in this directory," not "how much of this book is written."

**Before any claim about chapter length, quality, or completeness, check which track you read.**

```bash
for f in book/chapters/*.md; do
  b=$(basename "$f"); d="book/drafts/chapters/$b"
  diff -q "$f" "$d" >/dev/null 2>&1 || echo "DIFFERS: $b ($(wc -w < "$f")w vs $(wc -w < "$d")w)"
done
```

A green build proves nothing here: `build_book.py` emits **both** manuscripts every time
(`build/Lean-and-Agile-draft.md` from drafts, `build/Lean-and-Agile.md` from chapters).

## Citations

`book/notes/evidence/citations-and-corrections.md` is the source of truth for every factual claim, with
verification labels: ✅ primary source opened · 🟡 named secondary only · ❌ do not print.

- **Do not add a statistic to the manuscript unless it is ✅ or 🟡 there**, attributed accordingly.
- Part 1 lists claims that must never appear (MTTR-is-an-ITIL-metric, 100:1 defect cost, $59.5B,
  1-10-100, Standish/CHAOS, "most powerful inhibitor", flow efficiency 5–15%). These are **preventive** —
  the manuscript has never contained them, because it contains almost no statistics. Keep it that way.
- ⚠ `book/notes/editorial-feedback.md` contains items that instruct a writer to add false claims. Read
  its ⚠ annotations before executing anything in it.
- Never quote a PDF from a fetch-tool summary. Extract the text and quote that. A summary of the METR
  paper invented a confidence interval that appears nowhere in it.

## Voice

`book/STYLE-AND-INTENT.md` is the blueprint — read it before writing prose. Notably: authorial **first
person is established** in the drafts track (`drafts/00-introduction.md`: "I will try to keep two
promises"), so first-person author evidence is in-voice, not an anomaly. Chapters follow a 7-beat rhythm
(opening scenario → big idea → methodology comparison → counterintuitive insight → takeaway → closing
scenario → reflection questions) and should not feel formulaic.

## Checks

```bash
python -m pytest book/tests/test_build_book.py -q
python book/tools/build_book.py validate
```

Both should pass and report no issues. Write output to a file rather than piping if you intend to report
the exit code.
