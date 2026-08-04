# Source Review and Classification

🔴 **CORRECTED 2026-08-04.** This file previously named `book/chapters/*.md` as the canonical manuscript
source and classified "chapter drafts" as archived support material. **Both statements were wrong, and
the error was expensive.** `book/drafts/chapters/` holds the live manuscript — ~9,000 words ahead of
`book/chapters/`, longer in 13 of 14 files — and it is what the review app and the build both prefer.

The misclassification here, combined with contradictory wording in `book/README.md`, caused a full
editing session to be spent on the abandoned copy and produced two false conclusions about chapter
quality. Full account: `book/notes/editorial-feedback.md` → `## TRACK DIVERGENCE`.

⚠ **"Drafts" is a misleading name for the live manuscript, and renaming it is a real option** — but the
review app and `build_book.py` both hard-code the path, so a rename is a code change, not a `git mv`.
Until then, remember that in this repository *drafts are the book*.

## Active Sources

- **`book/drafts/chapters/*.md`: the live manuscript. Edit here.**
- `book/chapters/*.md`: downstream promoted copy — populated from drafts after review-app approval.
  **Do not hand-edit. Currently stale.**
- `book/assets/images/`: active book graphics
- `book/STYLE-AND-INTENT.md`: writing blueprint
- `book/notes/*.md`: editorial and structural guidance
- `Lean and Agile.docx`: original extraction source, kept for provenance during transition

## Archived Support Material

The following items are useful as historical context but should not remain front-and-center for editing once their key content has been captured:

- planning documents
- prompt guidance documents
- presentation notes
- raw feedback text

⚠ **"chapter drafts" was removed from this list.** `book/drafts/chapters/` is the working manuscript,
not archived material. Do not re-add it.

## Archive Rule

If the active Markdown source and notes now preserve a file's useful value, the original should move to `archive/` rather than remain in the working root.
