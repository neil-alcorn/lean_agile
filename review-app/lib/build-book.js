const fs = require("node:fs");
const path = require("node:path");
const { Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } = require("docx");

const { ROOT } = require("./book-files");
const { parseMarkdownDocument } = require("./review-logic");

const FIGURE_SLOT_RE = /<!--\s*FIGURE_SLOT:\s*([a-zA-Z0-9._-]+)\s*-->/g;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveBookArtifacts() {
  const bookConfig = readJson(path.join(ROOT, "book", "config", "book.json"));
  const figures = readJson(path.join(ROOT, "book", "config", "figures.json"));
  return { bookConfig, figures };
}

function renderFigureMarkdown(slot, figures, issues) {
  const figure = figures[slot];
  if (!figure) {
    issues.push(`Unresolved figure slot: ${slot}`);
    return `[FIGURE MISSING: ${slot}]`;
  }
  const imageLine = `![${figure.alt || slot}](${figure.path})`;
  return figure.caption ? `${imageLine}\n\n*${figure.caption}*` : imageLine;
}

function renderChapterBody(markdown, figures, issues) {
  return markdown.replace(FIGURE_SLOT_RE, (_match, slot) => renderFigureMarkdown(slot, figures, issues));
}

function buildMarkdownBook() {
  const { bookConfig, figures } = resolveBookArtifacts();
  const issues = [];
  const chapterPaths = bookConfig.chapters
    .slice()
    .sort((a, b) => a.chapter - b.chapter)
    .map((chapter) => path.join(ROOT, chapter.path));

  const renderedChapters = chapterPaths.map((chapterPath) => {
    const source = fs.readFileSync(chapterPath, "utf8");
    const parsed = parseMarkdownDocument(source);
    return renderChapterBody(parsed.body.trim(), figures, issues);
  });

  return {
    markdown: renderedChapters.join("\n\n---\n\n"),
    issues,
  };
}

function markdownToDocxParagraphs(markdown) {
  const paragraphs = [];
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.slice(2),
          heading: HeadingLevel.HEADING_1,
        }),
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.slice(3),
          heading: HeadingLevel.HEADING_2,
        }),
      );
      continue;
    }

    const imageMatch = trimmed.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (imageMatch) {
      const imagePath = path.join(ROOT, imageMatch[1].replaceAll("/", path.sep));
      if (fs.existsSync(imagePath)) {
        const extension = path.extname(imagePath).toLowerCase();
        if ([".png", ".jpg", ".jpeg"].includes(extension)) {
          paragraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: fs.readFileSync(imagePath),
                  transformation: { width: 500, height: 300 },
                }),
              ],
            }),
          );
          continue;
        }
      }
      paragraphs.push(new Paragraph({ text: trimmed }));
      continue;
    }

    if (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 2) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.slice(1, -1), italics: true })],
        }),
      );
      continue;
    }

    paragraphs.push(new Paragraph({ text: line }));
  }
  return paragraphs;
}

async function runBuild() {
  const { markdown, issues } = buildMarkdownBook();
  const buildDir = path.join(ROOT, "book", "build");
  fs.mkdirSync(buildDir, { recursive: true });

  const markdownPath = path.join(buildDir, "Lean-and-Agile.md");
  const validationPath = path.join(buildDir, "validation-report.txt");
  const docxPath = path.join(buildDir, "Lean-and-Agile.docx");

  fs.writeFileSync(markdownPath, markdown, "utf8");
  fs.writeFileSync(
    validationPath,
    issues.length ? `${issues.join("\n")}\n` : "No validation issues detected.\n",
    "utf8",
  );

  const document = new Document({
    sections: [
      {
        children: markdownToDocxParagraphs(markdown),
      },
    ],
  });

  const buffer = await Packer.toBuffer(document);
  fs.writeFileSync(docxPath, buffer);

  return {
    ok: true,
    issues,
    outputs: {
      markdown: "book/build/Lean-and-Agile.md",
      docx: "book/build/Lean-and-Agile.docx",
      validation: "book/build/validation-report.txt",
    },
  };
}

module.exports = {
  runBuild,
};
