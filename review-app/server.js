const express = require("express");
const path = require("node:path");
const mammoth = require("mammoth");

const {
  listChapters,
  readChapterPair,
} = require("./lib/book-files");
const {
  createReviewBlocks,
} = require("./lib/review-logic");
const {
  readReviewSession,
  writeReviewSession,
  clearReviewSession,
} = require("./lib/review-sessions");

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
    const chapter = readChapterPair(chapterPath);
    res.json({
      ...chapter,
      reviewSession: readReviewSession(chapterPath),
    });
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
    if (!chapterPath) {
      return res.status(400).json({ error: "chapterPath is required." });
    }

    const chapter = readChapterPair(chapterPath);
    const reviewBlocks = createReviewBlocks(chapter.sourceBody.trim(), chapter.draftBody.trim());

    return res.json({
      chapterPath,
      draftPath: chapter.draftPath,
      sourceContent: chapter.sourceContent,
      draftContent: chapter.draftContent,
      sourceBody: chapter.sourceBody,
      draftBody: chapter.draftBody,
      reviewBlocks,
      reviewSession: readReviewSession(chapterPath),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/review-session/save", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    const blocks = req.body?.blocks || [];

    if (!chapterPath) {
      return res.status(400).json({ error: "chapterPath is required." });
    }

    const saved = writeReviewSession(chapterPath, { blocks });

    return res.json({
      ok: true,
      chapterPath,
      sessionPath: saved.sessionPath,
      reviewSession: saved.payload,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/review-session/clear", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    if (!chapterPath) {
      return res.status(400).json({ error: "chapterPath is required." });
    }
    clearReviewSession(chapterPath);
    res.json({ ok: true, chapterPath });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Review app listening on http://localhost:${port}`);
});
