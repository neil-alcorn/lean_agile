const fs = require("node:fs");
const path = require("node:path");

const { ROOT } = require("./book-files");

const SESSIONS_DIR = path.join(ROOT, "review-app", "sessions");

function sessionFileNameForChapter(chapterPath) {
  return chapterPath.replaceAll("/", "__");
}

function sessionPathForChapter(chapterPath) {
  return path.join(SESSIONS_DIR, `${sessionFileNameForChapter(chapterPath)}.json`);
}

function readReviewSession(chapterPath) {
  const sessionPath = sessionPathForChapter(chapterPath);
  if (!fs.existsSync(sessionPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(sessionPath, "utf8"));
}

function writeReviewSession(chapterPath, data) {
  const sessionPath = sessionPathForChapter(chapterPath);
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  const payload = {
    chapterPath,
    savedAt: new Date().toISOString(),
    ...data,
  };
  fs.writeFileSync(sessionPath, JSON.stringify(payload, null, 2), "utf8");
  return { sessionPath, payload };
}

function clearReviewSession(chapterPath) {
  const sessionPath = sessionPathForChapter(chapterPath);
  if (fs.existsSync(sessionPath)) {
    fs.unlinkSync(sessionPath);
  }
}

module.exports = {
  SESSIONS_DIR,
  readReviewSession,
  writeReviewSession,
  clearReviewSession,
  sessionPathForChapter,
};
