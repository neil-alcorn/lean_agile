const express = require("express");
const path = require("node:path");
const { execFile } = require("node:child_process");
const mammoth = require("mammoth");

const {
  ROOT,
  listChapters,
  readChapterPair,
  writeChapter,
  writeDraftChapter,
} = require("./lib/book-files");
const {
  createReviewBlocks,
  createAlignedBlocks,
  applyEditedBlocks,
  replaceDocumentBody,
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
app.use("/book-assets", express.static(path.join(ROOT, "book", "assets")));

function loadAssetCatalog() {
  const catalog = {};
  const read = (file) => {
    try {
      return JSON.parse(
        require("node:fs").readFileSync(path.join(ROOT, "book", "config", file), "utf8")
      );
    } catch {
      return {};
    }
  };
  const figures = read("figures.json");
  for (const [id, fig] of Object.entries(figures)) {
    catalog[id] = {
      src: `/book-assets/${(fig.path || "").replace("book/assets/", "")}`,
      caption: fig.caption || "",
      type: "figure",
    };
  }
  const assets = read("assets.json");
  for (const [id, asset] of Object.entries(assets)) {
    catalog[id] = {
      src: `/book-assets/${(asset.source_path || "").replace("book/assets/", "")}`,
      caption: asset.caption || "",
      type: asset.type || "asset",
    };
  }
  return catalog;
}

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
      alignedBlocks: createAlignedBlocks(chapter.sourceBody.trim(), chapter.draftBody.trim()),
      reviewSession: readReviewSession(chapterPath),
      assets: loadAssetCatalog(),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/apply-edits", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    const blocks = req.body?.blocks || [];
    if (!chapterPath) {
      return res.status(400).json({ error: "chapterPath is required." });
    }

    const chapter = readChapterPair(chapterPath);
    const { body, changed } = applyEditedBlocks(chapter.draftBody.trim(), blocks);

    if (changed) {
      const newContent = replaceDocumentBody(chapter.draftContent, body);
      writeDraftChapter(chapterPath, newContent);
    }

    const applied = new Set(
      blocks
        .filter((b) => b.status === "accepted" && (b.editedText || "").trim())
        .map((b) => b.id)
    );
    const remaining = blocks.map((b) =>
      applied.has(b.id) ? { ...b, editedText: "" } : b
    );
    writeReviewSession(chapterPath, { blocks: remaining });

    const fresh = readChapterPair(chapterPath);
    return res.json({
      ok: true,
      changed,
      chapterPath,
      draftContent: fresh.draftContent,
      sourceContent: fresh.sourceContent,
      reviewBlocks: createReviewBlocks(fresh.sourceBody.trim(), fresh.draftBody.trim()),
      alignedBlocks: createAlignedBlocks(fresh.sourceBody.trim(), fresh.draftBody.trim()),
      reviewSession: readReviewSession(chapterPath),
      assets: loadAssetCatalog(),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/promote", (req, res) => {
  try {
    const chapterPath = req.body?.chapterPath;
    if (!chapterPath) {
      return res.status(400).json({ error: "chapterPath is required." });
    }

    const chapter = readChapterPair(chapterPath);
    const changedBlocks = createAlignedBlocks(
      chapter.sourceBody.trim(),
      chapter.draftBody.trim()
    ).filter((b) => b.changed);

    if (changedBlocks.length > 0) {
      const session = readReviewSession(chapterPath);
      const statuses = new Map(
        (session?.blocks || []).map((b) => [b.id, b.status])
      );
      const unapproved = changedBlocks.filter(
        (b) => statuses.get(b.id) !== "accepted"
      );
      if (unapproved.length > 0) {
        return res.status(409).json({
          error: `${unapproved.length} block(s) are not accepted yet. Accept every block (or resolve flags) before promoting.`,
        });
      }
    }

    writeChapter(chapterPath, chapter.draftContent);
    const oldSession = readReviewSession(chapterPath);
    const keptNotes = (oldSession?.blocks || []).filter(
      (b) => b.status === "flagged" || (b.note || "").trim()
    );
    if (keptNotes.length > 0) {
      writeReviewSession(chapterPath, { blocks: keptNotes });
    } else {
      clearReviewSession(chapterPath);
    }

    const fresh = readChapterPair(chapterPath);
    return res.json({
      ok: true,
      chapterPath,
      sourceContent: fresh.sourceContent,
      draftContent: fresh.draftContent,
      reviewBlocks: createReviewBlocks(fresh.sourceBody.trim(), fresh.draftBody.trim()),
      alignedBlocks: createAlignedBlocks(fresh.sourceBody.trim(), fresh.draftBody.trim()),
      reviewSession: readReviewSession(chapterPath),
      assets: loadAssetCatalog(),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/api/history", (req, res) => {
  const chapterPath = req.query.path;
  if (!chapterPath) {
    return res.status(400).json({ error: "path is required." });
  }
  const draftPath = chapterPath.replace("book/chapters/", "book/drafts/chapters/");
  execFile(
    "git",
    [
      "log",
      "-n",
      "12",
      "--date=format:%Y-%m-%d %H:%M",
      "--pretty=format:%h%x09%ad%x09%s",
      "--",
      chapterPath,
      draftPath,
    ],
    { cwd: ROOT },
    (error, stdout) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      const entries = stdout
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [hash, date, ...subject] = line.split("\t");
          return { hash, date, subject: subject.join("\t") };
        });
      return res.json({ chapterPath, entries });
    }
  );
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
