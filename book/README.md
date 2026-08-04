# Lean and Agile Book Workspace

This directory is the active source tree for the book.

## 🔴 EDIT `drafts/chapters/` — NEVER `chapters/`

**This is the single most important rule in this repository. Read it before editing any prose.**

`drafts/chapters/` is where writing happens. `chapters/` is downstream: it receives content only after
the author approves it in the review app. **Anyone — human or AI — who edits `chapters/` directly is
editing the wrong track, and the review app will eventually overwrite it or silently diverge from it.**

**Why this is stated so loudly:** on 2026-08-04 the two tracks had drifted **~9,000 words apart**, with
`drafts/` ahead and longer in **13 of 14 files** (Chapter 6 by 3.8×). The older wording of this file and
of `notes/source-review.md` disagreed about which copy was canonical, and a full editing session was
spent improving `chapters/` — the abandoned copy — before the divergence was noticed. Conclusions about
chapter quality and length were drawn from the thin track and were wrong. See
`notes/editorial-feedback.md` → `## TRACK DIVERGENCE`.

**If you need to know how long or how finished a chapter is, measure `drafts/chapters/`.** Measuring
`chapters/` answers a narrower question than the one you are asking.

## Canonical Sources

- **`drafts/chapters/` — the working manuscript. Edit here.** The review app reads and writes this copy.
- `chapters/` — downstream promoted copy. **Do not hand-edit.** Treat as generated.
- `assets/images/` contains graphics used by the book.
- `assets/` contains the production asset folders for diagrams, tables, quotes, callouts, and images.
- `notes/` contains editorial feedback, chapter review notes, and working guidance that has not yet been folded into prose.
- `config/book.json` defines chapter order.
- `config/figures.json` registers reusable figure assets and captions.
- `config/assets.json` tracks richer visual assets, including captions, references, and attribution metadata.

## Build Workflow

Use the build tool to work with the book as a compiled manuscript:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe book\tools\build_book.py extract
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe book\tools\build_book.py build
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe book\tools\build_book.py validate
```

## Chapter File Rules

Each chapter file is Markdown with:

- front matter
- chapter prose
- optional figure slots
- optional editorial note comments

Figure slots use this form:

```md
<!-- FIGURE_SLOT: slot-id -->
```

Editorial reminders use this form:

```md
<!-- EDITORIAL_NOTE: guidance text -->
```

If a figure slot appears in a chapter but is not registered in `config/figures.json`, validation should report it.

## Working Principle

Treat this like an application for a book:

- chapters are modules
- notes are tracked work
- figures are registered assets
- the build step is the compiler

The goal is to make editing easy without losing the ability to assemble a clean whole.

## Copy Model

There are two chapter tracks, and they are **not** peers:

| | `drafts/chapters/` | `chapters/` |
| --- | --- | --- |
| Role | **the working manuscript** | downstream promoted copy |
| Edit by hand? | **yes — this is the only place to write** | **no — treat as generated** |
| Written by | the author, and the review app | promotion from drafts, after approval |
| Build output | `build/Lean-and-Agile-draft.md` | `build/Lean-and-Agile.md` |

`build_book.py` has two resolvers. `draft_chapter_paths_from_config()` prefers `drafts/chapters/`
per-file and falls back to `chapters/` only when a draft file is missing; `chapter_paths_from_config()`
reads `chapters/` exclusively. **Both artifacts are produced on every build, so a green build never tells
you the two tracks agree.** To compare them:

```bash
for f in book/chapters/*.md; do
  b=$(basename "$f"); d="book/drafts/chapters/$b"
  diff -q "$f" "$d" >/dev/null 2>&1 || echo "DIFFERS: $b ($(wc -w < "$f")w vs $(wc -w < "$d")w)"
done
```

⚠ **`chapters/` is currently ~9,000 words behind and should not be read as the book.** Reconciling the
two tracks is an open task; until it is done, treat `drafts/chapters/` as the manuscript and expect
`chapters/` to be stale.

## Review Workflow

The repository also includes a local browser review workstation under [review-app](C:\Users\nalco\OneDrive\Lean and Agile\review-app).

Use it to:

- compare a chapter against proposed text
- import `.docx` material for review
- accept or reject change blocks
- write approved changes into the editable draft copy
- trigger a rebuild of the compiled manuscript
