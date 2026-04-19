const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const BOOK_DIR = path.join(ROOT, "book");
const CONFIG_PATH = path.join(BOOK_DIR, "config", "book.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getBookConfig() {
  return readJson(CONFIG_PATH);
}

function toPosixPath(value) {
  return value.replaceAll("\\", "/");
}

function listChapters() {
  const config = getBookConfig();
  return config.chapters.map((chapter) => {
    const absolutePath = path.join(ROOT, chapter.path);
    const stats = fs.statSync(absolutePath);
    return {
      ...chapter,
      absolutePath,
      path: toPosixPath(chapter.path),
      lastModified: stats.mtime.toISOString(),
    };
  });
}

function resolveRepoPath(relativePath) {
  const normalized = relativePath.replaceAll("/", path.sep);
  const absolutePath = path.resolve(ROOT, normalized);
  const relative = path.relative(ROOT, absolutePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Path escapes repository root.");
  }

  return absolutePath;
}

function readChapter(relativePath) {
  const absolutePath = resolveRepoPath(relativePath);
  return {
    path: toPosixPath(relativePath),
    absolutePath,
    content: fs.readFileSync(absolutePath, "utf8"),
  };
}

function writeChapter(relativePath, content) {
  const absolutePath = resolveRepoPath(relativePath);
  fs.writeFileSync(absolutePath, content, "utf8");
  return {
    path: toPosixPath(relativePath),
    absolutePath,
  };
}

module.exports = {
  ROOT,
  BOOK_DIR,
  listChapters,
  readChapter,
  writeChapter,
  resolveRepoPath,
};
