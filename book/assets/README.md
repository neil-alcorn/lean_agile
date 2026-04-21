# Book Assets

This directory contains production-oriented visual assets for the book.

## Folders

- `images/` for photographs, screenshots, or image-based figures
- `diagrams/` for flow diagrams and conceptual visuals
- `tables/` for polished table assets when inline Markdown tables are not enough
- `callouts/` for styled callout assets when they need separate design treatment
- `quotes/` for quote treatments when they need separate visual production

## Philosophy

Use inline Markdown when it will compile cleanly and look polished enough.
Promote content to an asset when it needs layout control, reuse, or stronger presentation.

## Registration

Reusable or production-managed assets should be tracked in:

- `book/config/assets.json`

Each asset should have:

- stable `asset_id`
- `type`
- `status`
- `source_path`
- reader-facing metadata such as caption or reference
- attribution metadata such as credit and rights status

## Placeholder Contract

Chapter files should reference assets with placeholders such as:

```md
<!-- VISUAL: concept-diagram | id:hidden-factory-flow | purpose: Show how rework loops back into the system and creates invisible cost. -->
```

The compiler should resolve the asset and remove the placeholder text from final output.
