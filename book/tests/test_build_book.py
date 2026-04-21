import pathlib
import shutil
import unittest
import uuid

from book.tools import build_book

TMP_ROOT = pathlib.Path("book/tests/.tmp")


class BookBuildTests(unittest.TestCase):
    def make_temp_dir(self):
        TMP_ROOT.mkdir(parents=True, exist_ok=True)
        path = TMP_ROOT / uuid.uuid4().hex
        path.mkdir(parents=True, exist_ok=False)
        self.addCleanup(lambda: shutil.rmtree(path, ignore_errors=True))
        return path

    def test_extracts_expected_chapter_markers(self):
        markers = build_book.find_book_sections(pathlib.Path("Lean and Agile.docx"))
        self.assertGreaterEqual(len(markers), 13)
        self.assertEqual(markers[0]["slug"], "introduction")

    def test_validation_reports_unresolved_figure_slot(self):
        root = self.make_temp_dir()
        chapter = root / "chapter.md"
        chapter.write_text(
            "---\nchapter: 01\nslug: test\ntitle: Test\nstatus: draft\n---\n\n# Test\n\n<!-- FIGURE_SLOT: missing-figure -->\n",
            encoding="utf-8",
        )
        issues = build_book.validate_chapter_file(chapter, {}, {})
        self.assertTrue(any("missing-figure" in issue for issue in issues))

    def test_combined_markdown_includes_registered_figure(self):
        root = self.make_temp_dir()
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
        combined = build_book.render_markdown_book([chapter], figures, {})
        self.assertIn("![Alt text]", combined)
        self.assertIn("Caption text", combined)

    def test_visual_placeholder_uses_assets_registry(self):
        root = self.make_temp_dir()
        chapter = root / "chapter.md"
        chapter.write_text(
            "---\nchapter: 01\nslug: test\ntitle: Test\nstatus: draft\n---\n\n# Test\n\n<!-- VISUAL: concept-diagram | id:hidden-factory-flow | purpose: Explain flow. -->\n",
            encoding="utf-8",
        )
        assets = {
            "hidden-factory-flow": {
                "type": "diagram",
                "source_path": "book/assets/diagrams/hidden-factory-flow.png",
                "caption": "Hidden factory flow.",
                "alt_text": "Flow diagram",
            }
        }
        combined = build_book.render_markdown_book([chapter], {}, assets)
        self.assertIn("![Flow diagram]", combined)
        self.assertIn("Hidden factory flow.", combined)


if __name__ == "__main__":
    unittest.main()
