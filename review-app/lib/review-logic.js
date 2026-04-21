const { diffWordsWithSpace } = require("diff");

function parseMarkdownDocument(source) {
  if (!source.startsWith("---\n")) {
    return { frontMatter: {}, body: source };
  }

  const parts = source.split("\n---\n", 2);
  if (parts.length < 2) {
    return { frontMatter: {}, body: source };
  }

  const rawFrontMatter = parts[0].split("\n").slice(1);
  const frontMatter = {};

  for (const line of rawFrontMatter) {
    if (!line.trim() || !line.includes(":")) {
      continue;
    }
    const [key, ...rest] = line.split(":");
    frontMatter[key.trim()] = rest.join(":").trim();
  }

  return {
    frontMatter,
    body: parts[1],
  };
}

function splitBlocks(body) {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function createReviewBlocks(currentBody, proposedBody) {
  const currentBlocks = splitBlocks(currentBody);
  const proposedBlocks = splitBlocks(proposedBody);
  const maxLength = Math.max(currentBlocks.length, proposedBlocks.length);
  const reviewBlocks = [];

  for (let index = 0; index < maxLength; index += 1) {
    const currentText = currentBlocks[index] ?? "";
    const proposedText = proposedBlocks[index] ?? "";

    if (currentText === proposedText) {
      continue;
    }

    let type = "replace";
    if (!currentText && proposedText) {
      type = "insert";
    } else if (currentText && !proposedText) {
      type = "delete";
    }

    reviewBlocks.push({
      id: `block-${index}`,
      index,
      type,
      currentText,
      proposedText,
      ...createHighlightedDiffHtml(currentText, proposedText),
    });
  }

  return reviewBlocks;
}

function applyReviewDecisions(currentBody, proposedBody, reviewBlocks, decisions) {
  const currentBlocks = splitBlocks(currentBody);
  const proposedBlocks = splitBlocks(proposedBody);
  const maxLength = Math.max(currentBlocks.length, proposedBlocks.length);
  const blocksById = new Map(reviewBlocks.map((block) => [block.id, block]));
  const merged = [];

  for (let index = 0; index < maxLength; index += 1) {
    const blockId = `block-${index}`;
    const block = blocksById.get(blockId);
    const currentText = currentBlocks[index] ?? "";
    const proposedText = proposedBlocks[index] ?? "";

    if (!block) {
      if (currentText || proposedText) {
        merged.push(proposedText || currentText);
      }
      continue;
    }

    const decision = decisions[blockId] || "reject";

    if (decision === "accept") {
      if (proposedText) {
        merged.push(proposedText);
      }
      continue;
    }

    if (decision === "revise") {
      if (proposedText) {
        merged.push(proposedText);
      } else if (currentText) {
        merged.push(currentText);
      }
      continue;
    }

    if (currentText) {
      merged.push(currentText);
    }
  }

  return merged.join("\n\n");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createHighlightedDiffHtml(currentText, proposedText) {
  const currentParts = [];
  const editParts = [];
  const diff = diffWordsWithSpace(currentText || "", proposedText || "");

  for (const part of diff) {
    const safe = escapeHtml(part.value);
    if (part.added) {
      editParts.push(`<span class="diff-added">${safe}</span>`);
      continue;
    }
    if (part.removed) {
      currentParts.push(`<span class="diff-removed">${safe}</span>`);
      continue;
    }
    currentParts.push(safe);
    editParts.push(safe);
  }

  return {
    currentHtml: currentParts.join(""),
    editHtml: editParts.join(""),
  };
}

module.exports = {
  parseMarkdownDocument,
  createReviewBlocks,
  applyReviewDecisions,
  createHighlightedDiffHtml,
};
