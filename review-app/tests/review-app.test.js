const assert = require("node:assert/strict");

const {
  parseMarkdownDocument,
  createReviewBlocks,
  applyReviewDecisions,
} = require("../lib/review-logic");

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
