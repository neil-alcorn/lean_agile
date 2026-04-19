# Lean and Agile AI Review App Design

## Goal

Build a local, shareable review application for the book repository that lets the user and collaborators review chapter edits in a browser, compare current source against proposed changes or imported `.docx` files, accept or reject changes, and write accepted edits back into the canonical book source.

## Core Decision

The canonical source of truth remains the Markdown chapter files under `book/chapters/`.

`.docx` files are treated as:

- import sources
- review artifacts
- build outputs

They are not the long-term control plane for editing.

## Why This Approach

This project needs:

- AI-friendly editing
- Git-friendly history
- browser-based human review
- modular chapter workflows
- repeatable assembly into polished output

Markdown best satisfies the first four. A local review app supplies the fifth by creating a visible editorial workflow between AI-generated proposals and accepted source updates.

## Users

Primary user:

- Neil, working locally with Codex as the main orchestrator

Secondary users:

- collaborators reviewing changes in a local or shared Git-backed workflow

## High-Level Workflow

1. A current chapter exists in Markdown.
2. A new proposed source arrives from one of these inputs:
   - AI-generated revision
   - feedback note
   - imported `.docx`
   - pasted text
3. The app compares current and proposed content.
4. The user reviews the differences in a browser.
5. The user accepts, rejects, or flags changes for revision.
6. Accepted changes are written back into the canonical chapter file.
7. The build pipeline regenerates the compiled manuscript.

## Product Shape

This is a review workstation, not a generic writing app.

The browser app should feel like a control panel for the book:

- inspect source
- compare edits
- approve changes
- preview compiled output
- rebuild deliverables

## V1 Features

### 1. Chapter Library

Show:

- all chapter files
- chapter title
- chapter number
- status
- last modified time

Actions:

- open chapter
- compare with proposal
- preview compiled chapter

### 2. Proposal Intake

The app should accept proposal input from:

- another Markdown file
- pasted text
- imported `.docx`

Imported `.docx` should be converted into reviewable HTML or plain text for comparison.

### 3. Side-by-Side Review

The review screen should show:

- current chapter on one side
- proposed text on the other
- a diff view for changed blocks

The review model should work at the block or chunk level first, not per character. V1 should optimize for useful editorial decisions rather than perfectly emulating Word track changes.

### 4. Decision Controls

For each review block, the user should be able to:

- accept
- reject
- mark for revision

Accepted blocks should update a staged proposed chapter state before writing to disk.

### 5. Source Update

When the user confirms the review result, the app writes the accepted version back to the canonical chapter file.

### 6. Preview

The app should show a compiled preview for:

- the current chapter
- optionally the full manuscript later

V1 can use HTML preview generated from the accepted Markdown state.

### 7. Build Controls

The app should be able to trigger the existing build pipeline so the repository can regenerate:

- combined Markdown
- compiled `.docx`

## AI Role

Codex remains the orchestrator.

The app is not the AI. The app is the human review surface.

Codex responsibilities:

- generate proposed edits
- import and normalize new content
- map feedback to candidate changes
- repair source files
- maintain the build system

User responsibilities:

- approve or reject editorial decisions
- redirect intent
- flag nuance the AI should revisit

## Technical Architecture

### Source Layer

- `book/chapters/*.md`
- `book/notes/*.md`
- `book/config/*.json`

### Backend Layer

A small local service should:

- read and write chapter files
- import `.docx`
- produce diffable proposals
- persist review sessions
- trigger builds

### Frontend Layer

A local web app should:

- show chapter library
- display side-by-side review
- render diffs
- show preview state
- submit accept/reject actions

### Build Layer

Reuse and extend the existing Python build pipeline under `book/tools/`.

## Recommended Stack

### Frontend

- React
- local dev server
- `react-diff-viewer` for readable side-by-side diffs
- optional ProseMirror later if we need richer review interactions

### Backend

- Node.js server for browser-facing APIs
- filesystem operations scoped to the repo
- shell handoff to Python build tools when needed

### Import and Preview

- `mammoth.js` for `.docx` import to HTML/text
- `docx-preview` for raw `.docx` browser rendering when visual inspection matters

### Existing Build

- Python remains the manuscript build/compiler layer

This gives a pragmatic hybrid:

- Node/React for UX
- Python for manuscript assembly

## Data Model

### Chapter Record

- path
- chapter number
- title
- status
- content

### Review Session

- session id
- target chapter path
- proposal source
- current content snapshot
- proposed content snapshot
- diff blocks
- review decisions
- resulting merged content

### Proposal Source Types

- markdown_file
- pasted_text
- docx_import
- ai_generated
- feedback_mapped

## Review Strategy

V1 should review changes in chunks rather than attempt full Word-style tracked changes.

Why:

- easier to build
- easier to understand
- easier to accept/reject meaningfully
- works better for large AI-assisted rewrites

Fine-grained tracked changes can come later if needed.

## `.docx` Intake Strategy

When the user points to a `.docx`, the system should:

1. import the document
2. convert it to normalized HTML/text
3. map it to a target chapter
4. create a proposal session
5. show the comparison in the review app

This directly supports files like `C:\Users\nalco\Downloads\Lean and agile ch5 complete.docx`.

## Git and Sharing

The app itself should live in this repository so it can be shared with others.

The shareable workflow should be:

- clone repo
- install dependencies
- run review app locally
- review and accept changes
- rebuild outputs

Later, this could also be deployed or run over a shared internal network, but V1 should stay local-first.

## File Layout

Suggested app location:

- `review-app/` for the web application
- `review-app/server/` for APIs
- `review-app/src/` for UI

The existing `book/` tree remains the source domain.

## Non-Goals For V1

Do not try to build all of this immediately:

- Google Docs clone behavior
- live multiplayer editing
- full publisher-grade typesetting
- full inline character-level track changes parity with Word
- cloud hosting

V1 should instead focus on reliable review and approval flow.

## Success Criteria

V1 succeeds if the user can:

1. open a chapter in the browser
2. import a `.docx` or proposed text
3. compare current versus proposed
4. accept or reject changes
5. write accepted results back to the true chapter file
6. rebuild the manuscript

## Recommendation

Build a local-first, repository-backed review workstation with Codex driving the editorial logic and the browser app acting as the human approval surface. That gives the book a durable AI-native workflow without losing control, readability, or shareability.
