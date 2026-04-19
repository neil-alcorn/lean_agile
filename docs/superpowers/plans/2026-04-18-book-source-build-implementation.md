# Book Source Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing book folder into a modular Markdown-based manuscript workspace with chapter files, notes, assets, archive structure, and a tested build pipeline that assembles the book into combined Markdown and DOCX outputs.

**Architecture:** Use `book/` as the canonical active workspace. Extract the existing `.docx` manuscript into ordered Markdown chapter files with light front matter and figure-slot markers. Store figures and notes separately, then use a small Python build tool to validate chapters, resolve figure slots from a registry, and compile the full manuscript into Markdown and DOCX.

**Tech Stack:** Python 3, `python-docx`, standard library, Markdown source files, JSON config, `unittest`

---

### Task 1: Scaffold the book workspace

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\assets\images\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\notes\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\config\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\build\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\tools\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\tests\`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\archive\`

- [ ] **Step 1: Create the directory tree**

Run:

```powershell
New-Item -ItemType Directory -Force `
  -Path 'C:\Users\nalco\OneDrive\Lean and Agile\book\chapters',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\assets\images',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\notes',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\config',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\build',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\tools',`
        'C:\Users\nalco\OneDrive\Lean and Agile\book\tests',`
        'C:\Users\nalco\OneDrive\Lean and Agile\archive'
```

Expected: all directories are created or already exist.

- [ ] **Step 2: Verify the directory tree exists**

Run:

```powershell
Get-ChildItem 'C:\Users\nalco\OneDrive\Lean and Agile\book'
```

Expected: the new workspace folders appear.

### Task 2: Add failing tests for extraction and build behavior

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\tests\test_build_book.py`

- [ ] **Step 1: Write failing tests for chapter loading, figure-slot validation, and build outputs**

Add a test module that expects:

```python
import json
import pathlib
import tempfile
import unittest

from book.tools import build_book


class BookBuildTests(unittest.TestCase):
    def test_extracts_expected_chapter_markers(self):
        markers = build_book.find_book_sections(pathlib.Path("Lean and Agile.docx"))
        self.assertGreaterEqual(len(markers), 13)
        self.assertEqual(markers[0]["slug"], "introduction")

    def test_validation_reports_unresolved_figure_slot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            chapter = root / "chapter.md"
            chapter.write_text(
                "---\nchapter: 01\nslug: test\ntitle: Test\nstatus: draft\n---\n\n# Test\n\n<!-- FIGURE_SLOT: missing-figure -->\n",
                encoding="utf-8",
            )
            issues = build_book.validate_chapter_file(chapter, {})
            self.assertTrue(any("missing-figure" in issue for issue in issues))

    def test_combined_markdown_includes_registered_figure(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            image = root / "image.png"
            image.write_bytes(b"fake")
            chapter = root / "chapter.md"
            chapter.write_text(
                "---\nchapter: 01\nslug: test\ntitle: Test\nstatus: draft\n---\n\n# Test\n\nBody.\n\n<!-- FIGURE_SLOT: fig-1 -->\n",
                encoding="utf-8",
            )
            figures = {
                "fig-1": {
                    "path": str(image),
                    "alt": "Alt text",
                    "caption": "Caption text",
                }
            }
            combined = build_book.render_markdown_book([chapter], figures)
            self.assertIn("![Alt text]", combined)
            self.assertIn("Caption text", combined)
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest book.tests.test_build_book -v
```

Expected: FAIL because `book.tools.build_book` does not exist yet.

### Task 3: Implement the build tool

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\tools\__init__.py`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\tools\build_book.py`

- [ ] **Step 1: Create a minimal package file**

Add:

```python
"""Book build tools package."""
```

- [ ] **Step 2: Implement section discovery, front-matter parsing, figure validation, Markdown rendering, and DOCX compilation**

The build module should provide:

- `find_book_sections(docx_path)`
- `parse_front_matter(text)`
- `validate_chapter_file(chapter_path, figures)`
- `render_markdown_book(chapter_paths, figures)`
- `build_docx(chapter_paths, figures, output_path)`
- `main()`

It should:

- read the original manuscript using `python-docx`
- locate introduction, chapter, and epilogue boundaries
- parse simple front matter without third-party YAML
- render figure slots into Markdown image blocks when registered
- emit unresolved-slot warnings
- write DOCX output using `python-docx`

- [ ] **Step 3: Run tests to verify they pass**

Run:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest book.tests.test_build_book -v
```

Expected: PASS.

### Task 4: Extract the current manuscript into canonical chapter files

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\00-introduction.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\01-deming-legacy.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\02-management-owns-process.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\03-speak-up-culture.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\04-lean-six-sigma.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\05-agile-in-it.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\06-itil-stability.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\07-leadership-owns-process.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\08-coders-as-change-agents.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\09-pride-in-work.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\10-ai-automation-human-touch.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\11-ai-in-lean-agile-itil.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\12-future-proofing.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\chapters\13-epilogue.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\config\book.json`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\config\figures.json`

- [ ] **Step 1: Write a script path in the build tool that exports the manuscript into chapter files**

The extraction should preserve current text as-is, add front matter, and keep incomplete chapters rather than skipping them.

- [ ] **Step 2: Create the canonical chapter files**

Run:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe book\tools\build_book.py extract
```

Expected: all chapter files and config files are written.

- [ ] **Step 3: Verify chapter file count and order**

Run:

```powershell
Get-ChildItem 'C:\Users\nalco\OneDrive\Lean and Agile\book\chapters' | Select-Object Name
```

Expected: introduction, chapters 1-12, and epilogue all exist.

### Task 5: Capture notes, feedback, and image registration

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\notes\editorial-feedback.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\notes\chapter-review.md`
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\book\config\figures.json`

- [ ] **Step 1: Convert the feedback text file into a durable Markdown notes file**

The notes file should preserve the review content in readable Markdown and separate “feedback not yet incorporated” from manuscript prose.

- [ ] **Step 2: Create chapter-level review notes summarizing gaps, image ideas, and priorities**

Include at least:

- chapter completeness
- notable feedback
- image opportunities
- structural concerns

- [ ] **Step 3: Register the existing rework image in the figure registry**

The registry entry should include:

- slot id
- relative path
- alt text
- caption
- status

### Task 6: Archive reviewed legacy material and active assets

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\archive\source-material\`
- Move: reviewed legacy `.docx` and `.txt` files that are no longer active sources
- Move: `C:\Users\nalco\OneDrive\Lean and Agile\Hidden costs of rework.png` to `C:\Users\nalco\OneDrive\Lean and Agile\book\assets\images\hidden-costs-of-rework.png`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\archive\README.md`

- [ ] **Step 1: Create archive folders and provenance note**

Document why each file moved.

- [ ] **Step 2: Move superseded and support originals into the archive**

Archive likely includes:

- `Business Operating System Framework.docx`
- `ch 2 v1.docx`
- `Ch 2 v2.docx`
- `Chapter outline and summaries.docx`
- `Lean and Agile Knowledge Base.docx`
- `Lean_and_Agile_Edited.docx`
- `well-structured prompts to help you continue.docx`
- `dashboard_presentation.txt`
- `lean_agile_feedback.txt`

Keep `Lean and Agile.docx` local for provenance and extraction reference unless the canonical workflow is fully established.

- [ ] **Step 3: Move the active image into the assets folder**

Update figure config to match the new relative path.

### Task 7: Verify the assembled book outputs

**Files:**
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\book\tools\build_book.py`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\build\Lean-and-Agile.md`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\build\Lean-and-Agile.docx`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\book\build\validation-report.txt`

- [ ] **Step 1: Run the full build**

Run:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe book\tools\build_book.py build
```

Expected: combined Markdown, DOCX, and validation report are created.

- [ ] **Step 2: Re-run unit tests**

Run:

```powershell
C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest book.tests.test_build_book -v
```

Expected: PASS.

- [ ] **Step 3: Inspect output summary**

Run:

```powershell
Get-ChildItem 'C:\Users\nalco\OneDrive\Lean and Agile\book\build' | Select-Object Name,Length
```

Expected: output files exist and are non-empty.

