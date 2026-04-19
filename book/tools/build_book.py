import json
import re
import sys
from pathlib import Path

from docx import Document


ROOT = Path(__file__).resolve().parents[2]
BOOK_DIR = ROOT / "book"
CHAPTERS_DIR = BOOK_DIR / "chapters"
CONFIG_DIR = BOOK_DIR / "config"
BUILD_DIR = BOOK_DIR / "build"

FIGURE_SLOT_RE = re.compile(r"<!--\s*FIGURE_SLOT:\s*([a-zA-Z0-9._-]+)\s*-->")
SECTION_RE = re.compile(r"^(Introduction|Chapter\s+\d+|Epilogue)\b", re.IGNORECASE)
CHAPTER_NUMBER_RE = re.compile(r"^Chapter\s+(\d+)\b", re.IGNORECASE)


def slugify(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "section"


def chapter_filename(chapter_number, slug):
    return f"{chapter_number:02d}-{slug}.md"


def find_book_sections(docx_path):
    document = Document(str(docx_path))
    paragraphs = [p.text.strip() for p in document.paragraphs]
    markers = []

    for idx, text in enumerate(paragraphs):
        if not text or not SECTION_RE.match(text):
            continue

        section = {"index": idx, "title": text}
        chapter_match = CHAPTER_NUMBER_RE.match(text)

        if text.lower().startswith("introduction"):
            section["kind"] = "introduction"
            section["chapter"] = 0
            section["slug"] = "introduction"
        elif text.lower().startswith("epilogue"):
            section["kind"] = "epilogue"
            section["chapter"] = 13
            section["slug"] = "epilogue"
        elif chapter_match:
            chapter_number = int(chapter_match.group(1))
            title_part = text.split(":", 1)[1].strip() if ":" in text else text
            section["kind"] = "chapter"
            section["chapter"] = chapter_number
            section["slug"] = slugify(title_part)
        else:
            continue

        if (
            markers
            and section["kind"] == "chapter"
            and markers[-1]["kind"] == "chapter"
            and markers[-1]["chapter"] == section["chapter"]
            and section["index"] == markers[-1]["index"] + 1
        ):
            markers[-1] = section
        else:
            markers.append(section)

    return markers


def parse_front_matter(text):
    if not text.startswith("---\n"):
        return {}, text

    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, text

    raw_meta, body = parts
    meta_lines = raw_meta.splitlines()[1:]
    meta = {}
    current_key = None

    for line in meta_lines:
        if not line.strip():
            continue
        if line.startswith("  - ") and current_key:
            meta.setdefault(current_key, []).append(line[4:].strip())
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        current_key = key.strip()
        value = value.strip()
        meta[current_key] = value if value else []

    return meta, body


def read_text(path):
    return Path(path).read_text(encoding="utf-8")


def replace_figure_slots(body, figures, issues):
    def repl(match):
        slot = match.group(1)
        figure = figures.get(slot)
        if not figure:
            issues.append(f"Unresolved figure slot: {slot}")
            return f"\n[FIGURE MISSING: {slot}]\n"

        alt = figure.get("alt", slot)
        caption = figure.get("caption", "")
        path = figure.get("path", "")
        image_block = f"![{alt}]({path})"
        if caption:
            image_block += f"\n\n*{caption}*"
        return "\n" + image_block + "\n"

    return FIGURE_SLOT_RE.sub(repl, body)


def validate_chapter_file(chapter_path, figures):
    text = read_text(chapter_path)
    meta, body = parse_front_matter(text)
    issues = []
    for field in ("chapter", "slug", "title", "status"):
        if field not in meta:
            issues.append(f"{chapter_path.name}: missing metadata '{field}'")

    for slot in FIGURE_SLOT_RE.findall(body):
        if slot not in figures:
            issues.append(f"{chapter_path.name}: unresolved figure slot '{slot}'")

    return issues


def render_markdown_book(chapter_paths, figures):
    rendered = []
    for chapter_path in chapter_paths:
        text = read_text(chapter_path)
        _, body = parse_front_matter(text)
        issues = []
        rendered_body = replace_figure_slots(body.strip(), figures, issues)
        rendered.append(rendered_body.strip())
    return "\n\n---\n\n".join(part for part in rendered if part)


def add_markdown_to_docx(doc, markdown_text):
    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()
        if not line:
            doc.add_paragraph("")
            continue
        if line.startswith("# "):
            doc.add_heading(line[2:].strip(), level=1)
        elif line.startswith("## "):
            doc.add_heading(line[3:].strip(), level=2)
        elif line.startswith("!["):
            match = re.match(r"!\[[^\]]*\]\(([^)]+)\)", line)
            if match:
                image_path = Path(match.group(1))
                resolved = image_path if image_path.is_absolute() else ROOT / image_path
                if resolved.exists():
                    try:
                        doc.add_picture(str(resolved))
                    except Exception:
                        doc.add_paragraph(f"[IMAGE NOT EMBEDDED: {resolved.name}]")
                else:
                    doc.add_paragraph(f"[IMAGE MISSING: {match.group(1)}]")
        elif line.startswith("*") and line.endswith("*") and len(line) > 2:
            doc.add_paragraph(line.strip("*")).italic = True
        else:
            doc.add_paragraph(raw_line)


def build_docx(chapter_paths, figures, output_path):
    markdown = render_markdown_book(chapter_paths, figures)
    document = Document()
    add_markdown_to_docx(document, markdown)
    document.save(str(output_path))


def load_figures(figures_path):
    if not figures_path.exists():
        return {}
    return json.loads(figures_path.read_text(encoding="utf-8"))


def load_book_config(config_path):
    if not config_path.exists():
        return {"chapters": []}
    return json.loads(config_path.read_text(encoding="utf-8"))


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def extract_sections_from_docx(docx_path):
    document = Document(str(docx_path))
    paragraphs = [p.text.strip() for p in document.paragraphs]
    markers = find_book_sections(docx_path)
    extracted = []

    for i, marker in enumerate(markers):
        start = marker["index"]
        end = markers[i + 1]["index"] if i + 1 < len(markers) else len(paragraphs)
        content = [p for p in paragraphs[start:end] if p]
        extracted.append({"meta": marker, "content": content})

    return extracted


def write_chapter_files(sections):
    config = {"chapters": []}

    for section in sections:
        meta = section["meta"]
        content = section["content"]
        chapter_num = meta["chapter"]
        slug = meta["slug"]
        title = meta["title"]
        status = "draft"

        filename = chapter_filename(chapter_num, slug)
        path = CHAPTERS_DIR / filename

        lines = [
            "---",
            f"chapter: {chapter_num:02d}",
            f"slug: {slug}",
            f"title: {title}",
            f"status: {status}",
            "source: Lean and Agile.docx",
            "---",
            "",
        ]

        for idx, paragraph in enumerate(content):
            if idx == 0:
                lines.append(f"# {paragraph}")
                continue
            lines.append(paragraph)
            lines.append("")

        if chapter_num == 1:
            lines.append("<!-- FIGURE_SLOT: hidden-costs-of-rework -->")
            lines.append("")
            lines.append(
                "<!-- EDITORIAL_NOTE: Connect the hidden factory concept to a measurable rework-rate formula. -->"
            )
        elif chapter_num == 5:
            lines.append(
                "<!-- EDITORIAL_NOTE: Add a measurement section covering velocity, cycle time percentiles, commitment accuracy, and lead time. -->"
            )
        elif chapter_num == 6:
            lines.append(
                "<!-- EDITORIAL_NOTE: Expand with a worked example and ITIL metrics such as MTTR, change success rate, and availability. -->"
            )

        write_text(path, "\n".join(lines).strip() + "\n")
        config["chapters"].append(
            {
                "chapter": chapter_num,
                "slug": slug,
                "title": title,
                "path": str(path.relative_to(ROOT)).replace("\\", "/"),
            }
        )

    write_text(CONFIG_DIR / "book.json", json.dumps(config, indent=2))

    figures = {
        "hidden-costs-of-rework": {
            "path": "book/assets/images/hidden-costs-of-rework.png",
            "alt": "Hidden costs of rework",
            "caption": "A visual reminder that rework creates invisible cost throughout the system.",
            "status": "ready",
        }
    }
    write_text(CONFIG_DIR / "figures.json", json.dumps(figures, indent=2))


def chapter_paths_from_config(book_config):
    paths = []
    for item in sorted(book_config["chapters"], key=lambda row: row["chapter"]):
        paths.append(ROOT / item["path"])
    return paths


def build_outputs():
    book_config = load_book_config(CONFIG_DIR / "book.json")
    figures = load_figures(CONFIG_DIR / "figures.json")
    chapter_paths = chapter_paths_from_config(book_config)

    issues = []
    for chapter_path in chapter_paths:
        issues.extend(validate_chapter_file(chapter_path, figures))

    combined_markdown = render_markdown_book(chapter_paths, figures)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    write_text(BUILD_DIR / "Lean-and-Agile.md", combined_markdown)
    build_docx(chapter_paths, figures, BUILD_DIR / "Lean-and-Agile.docx")
    write_text(BUILD_DIR / "validation-report.txt", "\n".join(issues) if issues else "No validation issues detected.\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: build_book.py [extract|build|validate]")
        return 1

    command = sys.argv[1].lower()
    if command == "extract":
        sections = extract_sections_from_docx(ROOT / "Lean and Agile.docx")
        write_chapter_files(sections)
        return 0
    if command == "build":
        build_outputs()
        return 0
    if command == "validate":
        book_config = load_book_config(CONFIG_DIR / "book.json")
        figures = load_figures(CONFIG_DIR / "figures.json")
        chapter_paths = chapter_paths_from_config(book_config)
        issues = []
        for chapter_path in chapter_paths:
            issues.extend(validate_chapter_file(chapter_path, figures))
        print("\n".join(issues) if issues else "No validation issues detected.")
        return 0

    print(f"Unknown command: {command}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
