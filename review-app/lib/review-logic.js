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

module.exports = {
  parseMarkdownDocument,
  createReviewBlocks,
  applyReviewDecisions,
};
