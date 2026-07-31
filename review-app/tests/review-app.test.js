const assert = require("node:assert/strict");

const {
  parseMarkdownDocument,
  createReviewBlocks,
  applyReviewDecisions,
  createHighlightedDiffHtml,
} = require("../lib/review-logic");
const { draftPathForChapterPath } = require("../lib/book-files");

function run(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    error.message = `${name}: ${error.message}`;
    throw error;
  }
}

run("parseMarkdownDocument preserves front matter and body", () => {
  const source = [
    "---",
    "chapter: 05",
    "title: Chapter 5",
    "---",
    "",
    "# Chapter 5",
    "",
    "Paragraph one.",
  ].join("\n");

  const parsed = parseMarkdownDocument(source);
  assert.equal(parsed.frontMatter.chapter, "05");
  assert.match(parsed.body, /Paragraph one\./);
});

run("createReviewBlocks identifies changed blocks", () => {
  const current = "# Chapter 5\n\nParagraph one.\n\nParagraph two.";
  const proposed = "# Chapter 5\n\nParagraph one updated.\n\nParagraph two.";

  const blocks = createReviewBlocks(current, proposed);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "replace");
  assert.match(blocks[0].currentText, /Paragraph one\./);
  assert.match(blocks[0].proposedText, /Paragraph one updated\./);
});

run("applyReviewDecisions accepts proposed block", () => {
  const current = "# Chapter 5\n\nParagraph one.\n\nParagraph two.";
  const proposed = "# Chapter 5\n\nParagraph one updated.\n\nParagraph two.";
  const blocks = createReviewBlocks(current, proposed);

  const merged = applyReviewDecisions(current, proposed, blocks, {
    [blocks[0].id]: "accept",
  });

  assert.match(merged, /Paragraph one updated\./);
  assert.doesNotMatch(merged, /Paragraph one\./);
});

run("applyReviewDecisions rejects proposed block", () => {
  const current = "# Chapter 5\n\nParagraph one.\n\nParagraph two.";
  const proposed = "# Chapter 5\n\nParagraph one updated.\n\nParagraph two.";
  const blocks = createReviewBlocks(current, proposed);

  const merged = applyReviewDecisions(current, proposed, blocks, {
    [blocks[0].id]: "reject",
  });

  assert.match(merged, /Paragraph one\./);
  assert.doesNotMatch(merged, /Paragraph one updated\./);
});

run("draftPathForChapterPath maps source chapter into drafts tree", () => {
  const draftPath = draftPathForChapterPath(
    "book/chapters/05-agile-in-it-how-sprints-empower-teams-to-deliver-better-faster.md",
  );

  assert.equal(
    draftPath,
    "book/drafts/chapters/05-agile-in-it-how-sprints-empower-teams-to-deliver-better-faster.md",
  );
});

run("createHighlightedDiffHtml marks insertions and deletions", () => {
  const diff = createHighlightedDiffHtml("Paragraph one old.", "Paragraph one updated.");

  assert.match(diff.currentHtml, /diff-removed/);
  assert.match(diff.editHtml, /diff-added/);
});

const { applyEditedBlocks, replaceDocumentBody } = require("../lib/review-logic");

run("applyEditedBlocks writes accepted edited wording into the draft body", () => {
  const draft = "# Chapter 5\n\nParagraph one updated.\n\nParagraph two.";
  const { body, changed } = applyEditedBlocks(draft, [
    { id: "block-1", status: "accepted", editedText: "Paragraph one, editor's cut." },
    { id: "block-2", status: "flagged", editedText: "Should be ignored." },
  ]);
  assert.equal(changed, true);
  assert.match(body, /editor's cut/);
  assert.match(body, /Paragraph two\./);
  assert.doesNotMatch(body, /Should be ignored/);
});

run("applyEditedBlocks reports no change when nothing accepted has edits", () => {
  const draft = "# Chapter 5\n\nParagraph one.";
  const { changed } = applyEditedBlocks(draft, [
    { id: "block-1", status: "accepted", editedText: "" },
  ]);
  assert.equal(changed, false);
});

run("replaceDocumentBody preserves front matter", () => {
  const full = "---\nchapter: 05\ntitle: Chapter 5\n---\n\n# Old body\n";
  const result = replaceDocumentBody(full, "# New body\n\nParagraph.");
  assert.match(result, /^---\nchapter: 05/);
  assert.match(result, /# New body/);
  assert.doesNotMatch(result, /# Old body/);
});

const { createAlignedBlocks } = require("../lib/review-logic");

run("createAlignedBlocks returns every block pair with changed flags", () => {
  const current = "# Title\n\nSame paragraph.\n\nOld wording.";
  const proposed = "# Title\n\nSame paragraph.\n\nNew wording.";
  const aligned = createAlignedBlocks(current, proposed);
  assert.equal(aligned.length, 3);
  assert.equal(aligned[0].changed, false);
  assert.equal(aligned[1].changed, false);
  assert.equal(aligned[2].changed, true);
  assert.equal(aligned[2].type, "replace");
  assert.ok(aligned[2].currentHtml);
});

run("createAlignedBlocks keeps alignment across insertions", () => {
  const current = "# Title\n\nAlpha.\n\nBeta.\n\nGamma.";
  const proposed = "# Title\n\nAlpha.\n\nInserted paragraph.\n\nBeta.\n\nGamma.";
  const aligned = createAlignedBlocks(current, proposed);
  const changed = aligned.filter((b) => b.changed);
  assert.equal(changed.length, 1);
  assert.equal(changed[0].type, "insert");
  assert.match(changed[0].proposedText, /Inserted paragraph/);
  const same = aligned.filter((b) => !b.changed);
  assert.equal(same.length, 4);
});
