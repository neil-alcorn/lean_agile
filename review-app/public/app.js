const state = {
  chapters: [],
  selectedChapterPath: "",
  sourceContent: "",
  draftContent: "",
  reviewBlocks: [],
  session: { blocks: [] },
};

const els = {
  chapterList: document.getElementById("chapterList"),
  reloadChaptersBtn: document.getElementById("reloadChaptersBtn"),
  compareBtn: document.getElementById("compareBtn"),
  saveSessionBtn: document.getElementById("saveSessionBtn"),
  clearSessionBtn: document.getElementById("clearSessionBtn"),
  currentContent: document.getElementById("currentContent"),
  draftContent: document.getElementById("draftContent"),
  chapterStatus: document.getElementById("chapterStatus"),
  reviewBlocks: document.getElementById("reviewBlocks"),
  reviewSummary: document.getElementById("reviewSummary"),
};

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setActionState(enabled) {
  els.compareBtn.disabled = !enabled;
  els.saveSessionBtn.disabled = !enabled;
  els.clearSessionBtn.disabled = !enabled;
}

function sessionBlockMap() {
  const map = new Map();
  for (const block of state.session.blocks || []) {
    map.set(block.id, block);
  }
  return map;
}

function getSessionBlock(blockId) {
  const found = (state.session.blocks || []).find((block) => block.id === blockId);
  if (found) {
    return found;
  }
  const fresh = { id: blockId, status: "pending", note: "", editedText: "" };
  state.session.blocks.push(fresh);
  return fresh;
}

function renderChapterList() {
  els.chapterList.innerHTML = "";
  state.chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = `chapter-item${state.selectedChapterPath === chapter.path ? " active" : ""}`;
    button.title = "Load this chapter's Book Copy and Edit Copy from disk.";
    button.innerHTML = `
      <strong>${chapter.chapter}. ${escapeHtml(chapter.title)}</strong>
      <span>${escapeHtml(chapter.path)}</span>
      <span>${chapter.hasDraft ? "Edit copy available" : "No edit copy yet"}</span>
    `;
    button.addEventListener("click", async () => {
      state.selectedChapterPath = chapter.path;
      await loadSelectedChapter();
      renderChapterList();
    });
    els.chapterList.appendChild(button);
  });
}

async function loadChapters() {
  const result = await api("/api/chapters");
  state.chapters = result.chapters;
  renderChapterList();
}

async function loadSelectedChapter() {
  if (!state.selectedChapterPath) {
    return;
  }
  const chapter = await api(`/api/chapter?path=${encodeURIComponent(state.selectedChapterPath)}`);
  state.sourceContent = chapter.sourceContent;
  state.draftContent = chapter.draftContent;
  state.session = chapter.reviewSession || { chapterPath: state.selectedChapterPath, blocks: [] };

  els.currentContent.textContent = chapter.sourceContent;
  els.draftContent.textContent = chapter.draftContent;
  els.chapterStatus.textContent = `Book: ${chapter.sourcePath} | Edit: ${chapter.draftPath}`;
  setActionState(true);
  await compareBookAndEdit();
}

async function compareBookAndEdit() {
  if (!state.selectedChapterPath) {
    return;
  }
  const result = await api("/api/compare", {
    method: "POST",
    body: JSON.stringify({ chapterPath: state.selectedChapterPath }),
  });

  state.sourceContent = result.sourceContent;
  state.draftContent = result.draftContent;
  state.reviewBlocks = result.reviewBlocks;
  if (result.reviewSession) {
    state.session = result.reviewSession;
  } else if (!state.session.chapterPath) {
    state.session = { chapterPath: state.selectedChapterPath, blocks: [] };
  }

  els.currentContent.textContent = result.sourceContent;
  els.draftContent.textContent = result.draftContent;
  renderReviewBlocks();
}

function renderReviewBlocks() {
  els.reviewBlocks.innerHTML = "";
  const blocks = state.reviewBlocks || [];
  if (!blocks.length) {
    els.reviewBlocks.innerHTML = "<p class='muted'>No differences between Book Copy and Edit Copy for this chapter.</p>";
    els.reviewSummary.textContent = "No pending differences.";
    return;
  }

  const sessions = sessionBlockMap();
  let accepted = 0;
  let rejected = 0;
  let needsAi = 0;
  let edited = 0;

  blocks.forEach((block) => {
    const sessionBlock = sessions.get(block.id) || getSessionBlock(block.id);
    if (sessionBlock.status === "accepted") accepted += 1;
    if (sessionBlock.status === "rejected") rejected += 1;
    if (sessionBlock.status === "needs_ai_revision") needsAi += 1;
    if (sessionBlock.editedText?.trim()) edited += 1;

    const wrapper = document.createElement("article");
    wrapper.className = "review-block";
    wrapper.innerHTML = `
      <div class="review-block-header">
        <div>
          <strong>${escapeHtml(block.type.toUpperCase())}</strong>
          <div class="block-status">${escapeHtml(sessionBlock.status || "pending")}</div>
        </div>
        <div class="decision-group">
          <button data-action="accepted" title="Mark this block as approved. Codex can later promote this change into the official book copy.">Accept</button>
          <button data-action="rejected" title="Keep the official book copy for this block.">Reject</button>
          <button data-action="needs_ai_revision" title="Flag this block for another AI revision pass in this chat.">Needs AI Revision</button>
        </div>
      </div>
      <div class="review-columns">
        <div>
          <h4>Book Copy</h4>
          <div class="diff-box">${block.currentHtml || escapeHtml(block.currentText || "[empty]")}</div>
        </div>
        <div>
          <h4>Edit Copy</h4>
          <div class="diff-box">${block.editHtml || escapeHtml(block.proposedText || "[empty]")}</div>
        </div>
      </div>
      <div class="review-fields">
        <label class="field">
          <span>My edited wording</span>
          <textarea data-role="editedText" rows="4" title="Optional temporary manual rewrite for this block. Codex can use it as the next edit target.">${escapeHtml(sessionBlock.editedText || "")}</textarea>
        </label>
        <label class="field">
          <span>Note for Codex</span>
          <textarea data-role="note" rows="3" title="Temporary note for this block. Use this to explain what should change or why you accepted/rejected it.">${escapeHtml(sessionBlock.note || "")}</textarea>
        </label>
      </div>
    `;

    wrapper.querySelectorAll("button[data-action]").forEach((button) => {
      if (sessionBlock.status === button.dataset.action) {
        button.classList.add("selected");
      }
      button.addEventListener("click", () => {
        getSessionBlock(block.id).status = button.dataset.action;
        renderReviewBlocks();
      });
    });

    wrapper.querySelector('[data-role="editedText"]').addEventListener("input", (event) => {
      getSessionBlock(block.id).editedText = event.target.value;
      renderSummaryOnly();
    });

    wrapper.querySelector('[data-role="note"]').addEventListener("input", (event) => {
      getSessionBlock(block.id).note = event.target.value;
    });

    els.reviewBlocks.appendChild(wrapper);
  });

  renderSummaryOnly({ blocks, accepted, rejected, needsAi, edited });
}

function renderSummaryOnly(summary = null) {
  let blocks = state.reviewBlocks || [];
  let accepted = 0;
  let rejected = 0;
  let needsAi = 0;
  let edited = 0;

  if (summary) {
    ({ blocks, accepted, rejected, needsAi, edited } = summary);
  } else {
    for (const block of state.session.blocks || []) {
      if (block.status === "accepted") accepted += 1;
      if (block.status === "rejected") rejected += 1;
      if (block.status === "needs_ai_revision") needsAi += 1;
      if (block.editedText?.trim()) edited += 1;
    }
  }

  els.reviewSummary.textContent = `${accepted} accepted | ${rejected} rejected | ${needsAi} needs AI revision | ${edited} manually edited | ${blocks.length} changed blocks`;
}

async function saveSession() {
  if (!state.selectedChapterPath) {
    return;
  }
  const result = await api("/api/review-session/save", {
    method: "POST",
    body: JSON.stringify({
      chapterPath: state.selectedChapterPath,
      blocks: state.session.blocks || [],
    }),
  });
  state.session = result.reviewSession;
  els.reviewSummary.textContent = `Review session saved at ${new Date(result.reviewSession.savedAt).toLocaleString()}`;
}

async function clearSession() {
  if (!state.selectedChapterPath) {
    return;
  }
  await api("/api/review-session/clear", {
    method: "POST",
    body: JSON.stringify({ chapterPath: state.selectedChapterPath }),
  });
  state.session = { chapterPath: state.selectedChapterPath, blocks: [] };
  renderReviewBlocks();
  els.reviewSummary.textContent = "Temporary review session cleared.";
}

els.reloadChaptersBtn.addEventListener("click", async () => {
  await loadChapters();
  if (state.selectedChapterPath) {
    await loadSelectedChapter();
  }
});
els.compareBtn.addEventListener("click", compareBookAndEdit);
els.saveSessionBtn.addEventListener("click", saveSession);
els.clearSessionBtn.addEventListener("click", clearSession);

loadChapters().catch((error) => {
  els.chapterStatus.textContent = error.message;
});
