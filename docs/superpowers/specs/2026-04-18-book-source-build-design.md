# Lean and Agile Book Source and Build Design

## Goal

Convert the current manuscript and supporting material into a chapter-based book workspace that is easy to edit with AI tools, easy to track in Git, and capable of assembling polished outputs from modular source files.

## Current Project Context

The current folder contains:

- one likely source-of-truth manuscript: `Lean and Agile.docx`
- one unincorporated feedback document: `lean_agile_feedback.txt`
- one current image asset likely useful in the finished product: `Hidden costs of rework.png`
- several supporting or superseded `.docx` files that should be archived once their useful context has been captured

The local folder is now a Git repository connected to the existing GitHub remote, but nothing has been pushed.

## Chosen Approach

Use Markdown as the canonical chapter source format, with a small amount of structure layered on top:

- chapter files in Markdown
- front matter for chapter metadata
- figure-slot markers for image placement
- editorial note markers for unresolved issues and guidance
- a small Python-based build pipeline that assembles the full manuscript

This is preferred over `.docx`-first authoring because text-based source is easier for AI tools, Git diffs, and future automation. It is preferred over XML- or LaTeX-first authoring because those formats add publishing rigidity too early.

## Repository Structure

The active book workspace should live under `book/` and contain:

- `book/chapters/` for canonical chapter source files
- `book/assets/images/` for images used in the book
- `book/notes/` for editorial notes, extracted guidance, chapter-specific recommendations, and backlog items
- `book/config/` for book-order and figure-registration data
- `book/build/` for generated outputs
- `book/tools/` for compile and validation scripts
- `book/tests/` for build and validation tests

Older or superseded source material should move under an `archive/` directory once reviewed and captured.

## Chapter File Format

Each chapter file should be Markdown with light front matter, for example:

```md
---
chapter: 05
slug: agile-in-it
title: Agile in IT
status: draft
source: Lean and Agile.docx
---

# Chapter 5: Agile in IT

Chapter prose goes here.

<!-- FIGURE_SLOT: hidden-costs-of-rework -->

<!-- EDITORIAL_NOTE: Add measurement section covering velocity, cycle time, commitment accuracy, and lead time. -->
```

The format should stay readable without tools. Any custom markers must remain sparse and obvious.

## Figure Model

Images should not be embedded as mysterious blobs in a chapter file. Instead:

- chapters declare figure slots
- a small registry maps slots to images, captions, alt text, and optional sizing
- the build script resolves slots into final output
- unresolved slots are reported by validation

This provides a clean workflow for:

- inserting existing images
- creating new diagrams later
- tracking missing assets
- preventing silent omissions during builds

## Notes Model

Editorial guidance should live outside the prose when it is not yet incorporated. Notes should be stored in dedicated files rather than mixed into narrative text, except for short in-place chapter markers where a local reminder is helpful.

Useful note categories:

- chapter-specific improvement notes
- cross-book concerns
- image ideas
- archive provenance notes

## Build Outputs

The initial build pipeline should support:

- combined Markdown manuscript
- assembled `.docx`

The design should leave room for `.pdf` later, but the first implementation does not need a full print-typesetting engine. The system should focus first on reliable modular assembly.

## Initial Build Responsibilities

The build pipeline should:

1. read chapter files in configured order
2. validate required metadata
3. detect unresolved figure slots
4. resolve registered figures into combined output
5. emit a combined Markdown file
6. emit a `.docx` manuscript
7. generate a validation report for missing assets or unresolved placeholders

## Archiving Rules

Files should move to `archive/` once one of these is true:

1. their content has been extracted into canonical Markdown source or notes
2. they are clearly superseded by newer files
3. they are preserved for provenance only, not active editing

The archive should preserve originals, not rewrite them.

## First Execution Scope

The initial implementation should:

- scaffold the active repository structure
- create all chapter files from the current manuscript, including incomplete chapters
- capture unincorporated feedback in notes rather than forcing it into prose
- relocate reviewed legacy material into `archive/`
- register the current image asset
- create a build script and validation script
- add tests for chapter loading, slot validation, and combined build output

## Constraints

- Keep existing originals local
- Do not push changes yet
- Prefer boring, inspectable tooling over clever publishing machinery
- Optimize for AI collaboration, Git readability, and future extensibility

## Recommendation

Treat this as a book application with a manuscript source tree. Chapters are modules, figures are registered assets, notes are tracked work, and the build step is the compiler. That gives the project a clean place for writing, graphics, review, and future publisher-facing output without locking the manuscript inside binary documents.
