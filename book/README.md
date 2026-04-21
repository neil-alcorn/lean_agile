# Lean and Agile Book Workspace

This directory is the active source tree for the book.

## Canonical Sources

- `chapters/` contains the canonical manuscript source files.
- `drafts/chapters/` contains the editable working copies used by the review app.
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

There are now two chapter tracks:

- `chapters/` is the stable build/source copy
- `drafts/chapters/` is the editable review copy

The review app writes approved edits into `drafts/chapters/`.
Builds prefer the draft copy when it exists.

## Review Workflow

The repository also includes a local browser review workstation under [review-app](C:\Users\nalco\OneDrive\Lean and Agile\review-app).

Use it to:

- compare a chapter against proposed text
- import `.docx` material for review
- accept or reject change blocks
- write approved changes into the editable draft copy
- trigger a rebuild of the compiled manuscript
