const fs = require("node:fs");
const path = require("node:path");
const { parseMarkdownDocument } = require("./review-logic");

const ROOT = path.resolve(__dirname, "..", "..");
const BOOK_DIR = path.join(ROOT, "book");
const CONFIG_PATH = path.join(BOOK_DIR, "config", "book.json");
const CHAPTER_PREFIX = "book/chapters/";
const DRAFT_PREFIX = "book/drafts/chapters/";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getBookConfig() {
  return readJson(CONFIG_PATH);
}

function toPosixPath(value) {
  return value.replaceAll("\\", "/");
}

function draftPathForChapterPath(relativePath) {
  const normalized = toPosixPath(relativePath);
  if (!normalized.startsWith(CHAPTER_PREFIX)) {
    throw new Error("Drafts can only be created for canonical chapter files.");
  }
  return normalized.replace(CHAPTER_PREFIX, DRAFT_PREFIX);
}

function listChapters() {
  const config = getBookConfig();
  return config.chapters.map((chapter) => {
    const absolutePath = path.join(ROOT, chapter.path);
    const draftPath = draftPathForChapterPath(chapter.path);
    const draftAbsolutePath = path.join(ROOT, draftPath);
    const stats = fs.statSync(absolutePath);
    const hasDraft = fs.existsSync(draftAbsolutePath);
    const draftStats = hasDraft ? fs.statSync(draftAbsolutePath) : null;
    return {
      ...chapter,
      absolutePath,
      path: toPosixPath(chapter.path),
      draftPath,
      draftAbsolutePath,
      lastModified: stats.mtime.toISOString(),
      sourceLastModified: stats.mtime.toISOString(),
      draftLastModified: draftStats ? draftStats.mtime.toISOString() : null,
      hasDraft,
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

function ensureDraftForChapter(relativePath) {
  const sourceAbsolutePath = resolveRepoPath(relativePath);
  const draftRelativePath = draftPathForChapterPath(relativePath);
  const draftAbsolutePath = resolveRepoPath(draftRelativePath);

  fs.mkdirSync(path.dirname(draftAbsolutePath), { recursive: true });
  if (!fs.existsSync(draftAbsolutePath)) {
    fs.copyFileSync(sourceAbsolutePath, draftAbsolutePath);
  }

  return {
    sourceAbsolutePath,
    draftRelativePath,
    draftAbsolutePath,
  };
}

function readChapterPair(relativePath) {
  const source = readChapter(relativePath);
  const { draftRelativePath, draftAbsolutePath } = ensureDraftForChapter(relativePath);
  const draftContent = fs.readFileSync(draftAbsolutePath, "utf8");
  const parsedSource = parseMarkdownDocument(source.content);
  const parsedDraft = parseMarkdownDocument(draftContent);
  const sourceStats = fs.statSync(source.absolutePath);
  const draftStats = fs.statSync(draftAbsolutePath);

  return {
    path: toPosixPath(relativePath),
    sourcePath: toPosixPath(relativePath),
    draftPath: toPosixPath(draftRelativePath),
    sourceAbsolutePath: source.absolutePath,
    draftAbsolutePath,
    sourceContent: source.content,
    draftContent,
    sourceBody: parsedSource.body,
    draftBody: parsedDraft.body,
    sourceLastModified: sourceStats.mtime.toISOString(),
    draftLastModified: draftStats.mtime.toISOString(),
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

function writeDraftChapter(relativePath, content) {
  const { draftRelativePath, draftAbsolutePath } = ensureDraftForChapter(relativePath);
  fs.writeFileSync(draftAbsolutePath, content, "utf8");
  return {
    path: toPosixPath(draftRelativePath),
    absolutePath: draftAbsolutePath,
  };
}

module.exports = {
  ROOT,
  BOOK_DIR,
  CHAPTER_PREFIX,
  DRAFT_PREFIX,
  listChapters,
  readChapter,
  readChapterPair,
  writeChapter,
  writeDraftChapter,
  resolveRepoPath,
  draftPathForChapterPath,
  ensureDraftForChapter,
};
