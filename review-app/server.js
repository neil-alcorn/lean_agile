const express = require("express");
const mammoth = require("mammoth");
const path = require("node:path");
const { spawn } = require("node:child_process");

const {
  listChapters,
  readChapter,
  writeChapter,
  ROOT,
} = require("./lib/book-files");
const {
  parseMarkdownDocument,
  createReviewBlocks,
  applyReviewDecisions,
} = require("./lib/review-logic");
const { runBuild } = require("./lib/build-book");

const app = express();
const port = process.env.PORT || 4173;

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/chapters", (_req, res) => {
  res.json({ chapters: listChapters() });
});

app.get("/api/chapter", (req, res) => {
  try {
    const chapterPath = req.query.path;
    const chapter = readChapter(chapterPath);
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/proposal/text", (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "Proposal text is required." });
  }
  return res.json({
    sourceType: "pasted_text",
    text,
  });
});

app.post("/api/proposal/docx", async (req, res) => {
  try {
    const filename = req.body?.filename || "proposal.docx";
    const data = req.body?.data;
    if (!data) {
      return res.status(400).json({ error: "DOCX file data is required." });
    }

    const buffer = Buffer.from(data, "base64");
    const htmlResult = await mammoth.convertToHtml({ buffer });
    const textResult = await mammoth.extractRawText({ buffer });

    return res.json({
      sourceType: "docx_import",
      filename,
      html: htmlResult.value,
      text: textResult.value.trim(),
      messages: [...htmlResult.messages, ...textResult.messages],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/compare", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    const proposedText = req.body?.proposedText || "";
    if (!chapterPath || !proposedText.trim()) {
      return res.status(400).json({ error: "chapterPath and proposedText are required." });
    }

    const chapter = readChapter(chapterPath);
    const parsedCurrent = parseMarkdownDocument(chapter.content);
    const parsedProposed = parseMarkdownDocument(proposedText);
    const currentBody = parsedCurrent.body.trim();
    const proposedBody = (Object.keys(parsedProposed.frontMatter).length ? parsedProposed.body : proposedText).trim();
    const reviewBlocks = createReviewBlocks(currentBody, proposedBody);
    const mergedBody = applyReviewDecisions(currentBody, proposedBody, reviewBlocks, {});
    const mergedContent = rebuildMarkdown(parsedCurrent.frontMatter, mergedBody);

    return res.json({
      chapterPath,
      currentContent: chapter.content,
      currentBody,
      proposedText,
      proposedBody,
      reviewBlocks,
      mergedBody,
      mergedContent,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/apply", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    const proposedText = req.body?.proposedText || "";
    const decisions = req.body?.decisions || {};
    const previewOnly = Boolean(req.body?.previewOnly);

    if (!chapterPath || !proposedText.trim()) {
      return res.status(400).json({ error: "chapterPath and proposedText are required." });
    }

    const chapter = readChapter(chapterPath);
    const parsedCurrent = parseMarkdownDocument(chapter.content);
    const parsedProposed = parseMarkdownDocument(proposedText);
    const currentBody = parsedCurrent.body.trim();
    const proposedBody = (Object.keys(parsedProposed.frontMatter).length ? parsedProposed.body : proposedText).trim();
    const reviewBlocks = createReviewBlocks(currentBody, proposedBody);
    const mergedBody = applyReviewDecisions(currentBody, proposedBody, reviewBlocks, decisions);
    const mergedContent = rebuildMarkdown(parsedCurrent.frontMatter, mergedBody);

    if (!previewOnly) {
      writeChapter(chapterPath, mergedContent.endsWith("\n") ? mergedContent : `${mergedContent}\n`);
    }

    return res.json({
      ok: true,
      chapterPath,
      mergedContent,
      reviewBlocks,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/build", async (_req, res) => {
  try {
    const result = await runBuild();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function rebuildMarkdown(frontMatter, body) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontMatter)) {
    lines.push(`${key}: ${value}`);
  }
  lines.push("---", "", body.trim(), "");
  return lines.join("\n");
}

app.listen(port, () => {
  console.log(`Review app listening on http://localhost:${port}`);
});
