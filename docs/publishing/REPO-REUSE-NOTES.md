# Reusing This Structure For Future Books

This publishing structure is reusable.

If a future book gets its own repo, the easiest path is:

1. start from this repo structure as a template
2. rename the book-specific files
3. clear the manuscript, draft, build, and target-specific data
4. keep the publishing workspace, review app model, asset system, and build philosophy

## What Would Need To Change For A New Book

- book title and subtitle
- chapter files
- style and intent guide
- assets and asset registry
- proposal positioning
- comps
- target list
- author-platform angle for that specific topic

## What Can Stay The Same

- split between stable book copy and edit copy
- review-app concept
- build pipeline shape
- asset placeholder system
- visual philosophy workflow
- publishing workspace under `docs/publishing/`

## Practical Future Rule

If we do another book, we should create the new repo from a cleaned template state, not from a copy of this repo with stale targets and manuscript history left inside it.
