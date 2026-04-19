# Lean and Agile Review App

This is the local browser review workstation for the book.

## What It Does

- loads canonical chapters from `book/chapters/`
- accepts proposal text pasted into the browser
- imports `.docx` content for review
- compares current chapter text against proposed text
- lets the reviewer accept, reject, or flag changed blocks
- writes accepted content back into the canonical chapter file
- triggers the existing book rebuild

## Source of Truth

The browser app is a review surface. The canonical manuscript still lives in:

- `book/chapters/*.md`

Imported `.docx` files are intake material, not the persistent source of truth.

## Install

From the `review-app/` directory:

```powershell
npm.cmd install
```

## Run

```powershell
npm.cmd start
```

Then open:

`http://localhost:4173`

## Typical Workflow

1. Select a chapter from the library.
2. Paste proposed text or import a `.docx`.
3. Click compare.
4. Review changed blocks.
5. Accept or reject changes.
6. Apply approved changes to the chapter source.
7. Rebuild the manuscript.

## DOCX Intake

`.docx` intake is handled through Mammoth and converted into reviewable text. This is especially useful for files such as alternate chapter drafts or externally edited material.

## Notes

- V1 reviews at the block level rather than full inline tracked changes.
- The app is local-first and designed to work well with Codex driving the editorial process.
