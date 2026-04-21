# Lean and Agile Visual and Asset Philosophy Design

## Goal

Define a clear editorial philosophy for visuals in the book, then turn that philosophy into a reliable source format and compile model that supports diagrams, tables, images, callout boxes, quotes, captions, and references without cluttering the chapter prose.

## Why This Matters

The book should be visually appealing and structurally readable without becoming decorative, formulaic, or bloated. Visuals should help the reader understand hard concepts, pace the reading experience, and reinforce the book's authority and polish.

The editorial principle is:

> A visual earns its place by clarifying a concept first. Breathing room and polish are important, but secondary.

## Visual Philosophy

Visuals should not exist as filler. They belong when prose alone would make the reader work harder than necessary.

The book should use visuals to:

- clarify a concept
- give the reader a breath at the right moment
- make the book feel polished and persuasive

If forced to prioritize, the first obligation is concept clarification.

## Types of Visual Elements

The book should use a small, deliberate vocabulary of visual elements:

1. **Concept Diagram**
   - Use for systems, relationships, feedback loops, flows, and framework interaction.

2. **Callout Box**
   - Use for key ideas, warnings, subtle takeaways, practical heuristics, or memorable reframings.

3. **Quote Block**
   - Use for Deming, Drucker, or other thought-leader lines worth pausing on.

4. **Comparison Table**
   - Use to simplify distinctions between methodologies, assumptions, or choices.

5. **Example Graphic**
   - Use when a concrete image or polished diagram makes a scenario or metric easier to grasp.

## Editorial Rules

- Not every chapter should have the same number of visuals.
- Visuals should appear by judgment, not by quota.
- Dense conceptual passages may need diagrams.
- Long text stretches may need a callout or quote as a pacing break.
- Operational chapters may benefit from tables or flow visuals.
- Visuals should reinforce the enduring-principles theme: AI changes tools, not fundamental truths.

## Inline vs Asset-Backed Rule

Default rule:

> Inline by default. Asset when needed for quality, reuse, or layout control.

### Keep Inline in Chapter Files

Use inline Markdown or chapter-local markup for:

- simple tables
- short quote blocks
- small callouts
- brief references or citations
- straightforward comparison structures

### Promote to Asset

Use an asset when the content needs:

- a diagram
- a designed image
- polished table layout
- reuse across chapters
- special caption/footer handling
- stronger layout control during compile

## Placeholder Contract

Each visual placeholder should carry:

1. what kind of visual belongs there
2. the stable asset id
3. the editorial purpose of the visual

Recommended format:

```md
<!-- VISUAL: concept-diagram | id:hidden-factory-flow | purpose: Show how rework loops back into the system and creates invisible cost. -->
```

Another example:

```md
<!-- VISUAL: comparison-table | id:lean-agile-itil-lenses | purpose: Compare what each framework sees clearly, where it helps, and how it fails when misused. -->
```

These placeholders are editorial instructions, not reader-facing content.

## Compile Behavior

When compiling the book:

- placeholder comments must not appear in final output
- `purpose` text must not appear in final output
- only publication-facing metadata may survive, such as:
  - title
  - caption
  - footer
  - source/reference note

In short:

- `purpose` is for the editorial team
- `caption` is for the reader
- `reference` is for citation
- `asset_id` is for the compiler

## Asset Registry Model

All reusable or polished visuals should be registered in a central asset file, recommended path:

- `book/config/assets.json`

Suggested asset folder layout:

- `book/assets/images/`
- `book/assets/diagrams/`
- `book/assets/tables/`

Additional folders may be added later if needed, but the initial system should stay simple.

Each asset should have a stable `asset_id`.

Example registry entry:

```json
{
  "hidden-factory-flow": {
    "type": "diagram",
    "status": "idea",
    "source_path": "",
    "caption": "Rework creates invisible cost throughout the system.",
    "footer": "",
    "reference": "",
    "alt_text": "Diagram showing rework cycling back into the workflow.",
    "chapter_hint": 1,
    "credit": "",
    "credit_role": "",
    "rights_status": "unknown",
    "usage_notes": ""
  }
}
```

## Attribution Fields

Assets should support attribution and usage tracking from the beginning.

Recommended metadata fields:

- `credit`
- `credit_role`
- `reference`
- `rights_status`
- `usage_notes`

This allows the project to distinguish between:

- author-created assets
- internally created diagrams
- adapted visuals
- externally sourced visuals that need explicit permission or citation

## Asset Lifecycle

An asset may exist in several states:

- `idea`
- `draft`
- `ready`

This allows placeholders to exist before the visual is created.

The compiler should be able to validate:

- placeholder with no matching asset
- asset declared but source file missing
- asset registered but not used
- asset reused in multiple chapters

## Chapter Source Philosophy

Chapter files should stay readable and editable. Placeholders should be sparse and intentional. The chapter should not be overloaded with layout mechanics.

The working source should preserve only what is needed for editing and compiling:

- narrative text
- inline structures that compile cleanly
- explicit placeholder comments for non-inline visuals

## Reader-Facing Output

The final book should include polished, human-friendly visual presentation:

- captions where appropriate
- references where required
- credits where required
- footers only when they help
- clean visual rhythm

The raw placeholder code and editorial descriptions should disappear during build.

## Recommendation

Treat visuals the same way the project now treats chapters:

- the prose carries the meaning
- placeholders mark intent
- assets carry production-quality visuals
- the compiler resolves the final presentation

This preserves flexibility, keeps the source readable, and creates a reliable path from editorial idea to finished book artifact.
