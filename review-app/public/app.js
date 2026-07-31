const state = {
  chapters: [],
  selectedChapterPath: "",
  sourceContent: "",
  draftContent: "",
  reviewBlocks: [],
  session: { blocks: [] },
  saveTimer: null,
};

const els = {
  chapterList: document.getElementById("chapterList"),
  reloadChaptersBtn: document.getElementById("reloadChaptersBtn"),
  emptyState: document.getElementById("emptyState"),
  chapterView: document.getElementById("chapterView"),
  chapterTitle: document.getElementById("chapterTitle"),
  chapterStatus: document.getElementById("chapterStatus"),
  applyBtn: document.getElementById("applyBtn"),
  promoteBtn: document.getElementById("promoteBtn"),
  historyBtn: document.getElementById("historyBtn"),
  clearBtn: document.getElementById("clearBtn"),
  currentContent: document.getElementById("currentContent"),
  draftContent: document.getElementById("draftContent"),
  reviewBlocks: document.getElementById("reviewBlocks"),
  reviewSummary: document.getElementById("reviewSummary"),
  saveIndicator: document.getElementById("saveIndicator"),
  historyDrawer: document.getElementById("historyDrawer"),
  historyList: document.getElementById("historyList"),
  closeHistoryBtn: document.getElementById("closeHistoryBtn"),
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

function chapterLabel(chapter) {
  if (chapter.chapter === 0) return "Intro";
  if (chapter.slug === "epilogue") return "End";
  return String(chapter.chapter);
}

function shortTitle(chapter) {
  let title = chapter.title || "";
  title = title.replace(/^Chapter\s+\d+:\s*/i, "");
  title = title.replace(/^Epilogue:\s*/i, "Epilogue: ");
  return title;
}

function getSessionBlock(blockId) {
  const found = (state.session.blocks || []).find((block) => block.id === blockId);
  if (found) {
    if (found.status === "needs_ai_revision") found.status = "flagged";
    return found;
  }
  const fresh = { id: blockId, status: "pending", note: "", editedText: "" };
  state.session.blocks.push(fresh);
  return fresh;
}

/* ---------------------------------------------------------- autosave ---- */

function scheduleSave() {
  els.saveIndicator.textContent = "Saving…";
  els.saveIndicator.classList.remove("saved");
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(saveSession, 700);
}

async function saveSession() {
  if (!state.selectedChapterPath) return;
  try {
    const result = await api("/api/review-session/save", {
      method: "POST",
      body: JSON.stringify({
        chapterPath: state.selectedChapterPath,
        blocks: state.session.blocks || [],
      }),
    });
    state.session = result.reviewSession;
    const time = new Date(result.reviewSession.savedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    els.saveIndicator.textContent = `Saved ${time}`;
    els.saveIndicator.classList.add("saved");
  } catch (error) {
    els.saveIndicator.textContent = `Save failed: ${error.message}`;
    els.saveIndicator.classList.remove("saved");
  }
}

/* ---------------------------------------------------------- chapters ---- */

function renderChapterList() {
  els.chapterList.innerHTML = "";
  state.chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = `chapter-item${
      state.selectedChapterPath === chapter.path ? " active" : ""
    }`;
    button.title = shortTitle(chapter);
    button.innerHTML = `
      <span class="chapter-no">${escapeHtml(chapterLabel(chapter))}</span>
      <span class="chapter-name">${escapeHtml(shortTitle(chapter))}</span>
    `;
    button.addEventListener("click", async () => {
      state.selectedChapterPath = chapter.path;
      closeHistory();
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
  if (!state.selectedChapterPath) return;
  const result = await api("/api/compare", {
    method: "POST",
    body: JSON.stringify({ chapterPath: state.selectedChapterPath }),
  });
  applyCompareResult(result);
  const chapter = state.chapters.find((c) => c.path === state.selectedChapterPath);
  els.chapterTitle.textContent = chapter ? shortTitle(chapter) : "";
  els.emptyState.hidden = true;
  els.chapterView.hidden = false;
  els.saveIndicator.textContent = "";
}

function applyCompareResult(result) {
  state.sourceContent = result.sourceContent;
  state.draftContent = result.draftContent;
  state.reviewBlocks = result.reviewBlocks || [];
  if (result.reviewSession) {
    state.session = result.reviewSession;
  } else {
    state.session = { chapterPath: state.selectedChapterPath, blocks: [] };
  }
  els.currentContent.textContent = result.sourceContent;
  els.draftContent.textContent = result.draftContent;
  els.chapterStatus.textContent = "";
  renderReviewBlocks();
}

/* ------------------------------------------------------------- blocks ---- */

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  flagged: "Flagged for review",
};

function renderReviewBlocks() {
  els.reviewBlocks.innerHTML = "";
  const blocks = state.reviewBlocks || [];
  if (!blocks.length) {
    els.reviewBlocks.innerHTML =
      "<p class='muted all-clear'>Book Copy and Edit Copy match. Nothing to review in this chapter.</p>";
    els.reviewSummary.textContent = "";
    updateToolbar();
    return;
  }

  blocks.forEach((block, position) => {
    const sessionBlock = getSessionBlock(block.id);
    const status = sessionBlock.status || "pending";

    const wrapper = document.createElement("article");
    wrapper.className = `review-block status-${status}`;
    wrapper.innerHTML = `
      <div class="review-block-header">
        <div class="block-id">
          <span class="block-count">${position + 1} of ${blocks.length}</span>
          <span class="status-chip chip-${status}">${STATUS_LABELS[status] || status}</span>
        </div>
        <div class="decision-group">
          <button data-action="accepted" class="accept-btn" title="Approve this block. Your wording below becomes the Edit Copy when you Apply.">Accept</button>
          <button data-action="flagged" class="flag-btn" title="Flag this block for another pass. Use the note to say what should change (including 'delete this block').">Flag for review</button>
        </div>
      </div>
      <div class="review-columns">
        <div>
          <h4>Book Copy</h4>
          <div class="diff-box">${block.currentHtml || escapeHtml(block.currentText || "[not in book copy]")}</div>
        </div>
        <div>
          <h4>Edit Copy</h4>
          <div class="diff-box">${block.editHtml || escapeHtml(block.proposedText || "[removed in edit copy]")}</div>
        </div>
      </div>
      <div class="review-fields">
        <label class="field">
          <span>Your wording <span class="muted">(starts from the Edit Copy — change anything)</span></span>
          <textarea data-role="editedText" rows="4">${escapeHtml(
            sessionBlock.editedText || block.proposedText || ""
          )}</textarea>
        </label>
        <label class="field">
          <span>Note <span class="muted">(for the AI pass, reasons, or delete requests)</span></span>
          <textarea data-role="note" rows="2">${escapeHtml(sessionBlock.note || "")}</textarea>
        </label>
      </div>
    `;

    wrapper.querySelectorAll("button[data-action]").forEach((button) => {
      if (status === button.dataset.action) {
        button.classList.add("selected");
      }
      button.addEventListener("click", () => {
        const sb = getSessionBlock(block.id);
        sb.status = sb.status === button.dataset.action ? "pending" : button.dataset.action;
        if (sb.status === "accepted" && !sb.editedText) {
          const textarea = wrapper.querySelector('[data-role="editedText"]');
          if (textarea.value.trim() !== (block.proposedText || "").trim()) {
            sb.editedText = textarea.value;
          }
        }
        scheduleSave();
        renderReviewBlocks();
      });
    });

    wrapper.querySelector('[data-role="editedText"]').addEventListener("input", (event) => {
      getSessionBlock(block.id).editedText = event.target.value;
      scheduleSave();
    });

    wrapper.querySelector('[data-role="note"]').addEventListener("input", (event) => {
      getSessionBlock(block.id).note = event.target.value;
      scheduleSave();
    });

    els.reviewBlocks.appendChild(wrapper);
  });

  updateSummary();
  updateToolbar();
}

function updateSummary() {
  const blocks = state.reviewBlocks || [];
  let accepted = 0;
  let flagged = 0;
  for (const block of blocks) {
    const sb = getSessionBlock(block.id);
    if (sb.status === "accepted") accepted += 1;
    if (sb.status === "flagged") flagged += 1;
  }
  const pending = blocks.length - accepted - flagged;
  els.reviewSummary.textContent = `${blocks.length} changed · ${accepted} accepted · ${flagged} flagged · ${pending} pending`;
}

function updateToolbar() {
  const blocks = state.reviewBlocks || [];
  const allAccepted =
    blocks.length > 0 &&
    blocks.every((b) => getSessionBlock(b.id).status === "accepted");
  els.promoteBtn.disabled = !allAccepted;
  els.promoteBtn.title = allAccepted
    ? "Copy the Edit Copy over the Book Copy."
    : blocks.length === 0
      ? "Nothing to promote — the copies already match."
      : "Accept every changed block first.";
  els.applyBtn.disabled = blocks.length === 0;
}

/* ------------------------------------------------------------ actions ---- */

async function applyEdits() {
  if (!state.selectedChapterPath) return;
  clearTimeout(state.saveTimer);
  try {
    const result = await api("/api/apply-edits", {
      method: "POST",
      body: JSON.stringify({
        chapterPath: state.selectedChapterPath,
        blocks: state.session.blocks || [],
      }),
    });
    applyCompareResult(result);
    els.chapterStatus.textContent = result.changed
      ? "Your wording is now in the Edit Copy."
      : "No wording changes to apply — decisions saved.";
  } catch (error) {
    els.chapterStatus.textContent = `Apply failed: ${error.message}`;
  }
}

async function promoteChapter() {
  if (!state.selectedChapterPath) return;
  const ok = window.confirm(
    "Promote this chapter?\n\nThe Edit Copy will replace the Book Copy. This is the final step for the chapter."
  );
  if (!ok) return;
  try {
    const result = await api("/api/promote", {
      method: "POST",
      body: JSON.stringify({ chapterPath: state.selectedChapterPath }),
    });
    applyCompareResult(result);
    els.chapterStatus.textContent = "Promoted. Book Copy now matches the Edit Copy.";
    await loadChapters();
  } catch (error) {
    els.chapterStatus.textContent = `Promote blocked: ${error.message}`;
  }
}

async function clearDecisions() {
  if (!state.selectedChapterPath) return;
  const ok = window.confirm("Clear all decisions and notes for this chapter?");
  if (!ok) return;
  await api("/api/review-session/clear", {
    method: "POST",
    body: JSON.stringify({ chapterPath: state.selectedChapterPath }),
  });
  state.session = { chapterPath: state.selectedChapterPath, blocks: [] };
  renderReviewBlocks();
  els.chapterStatus.textContent = "Decisions cleared.";
}

/* ------------------------------------------------------------ history ---- */

async function openHistory() {
  if (!state.selectedChapterPath) return;
  try {
    const result = await api(
      `/api/history?path=${encodeURIComponent(state.selectedChapterPath)}`
    );
    els.historyList.innerHTML = "";
    if (!result.entries.length) {
      els.historyList.innerHTML = "<li class='muted'>No saved versions yet.</li>";
    }
    result.entries.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="history-date">${escapeHtml(entry.date)}</span>
        <span class="history-subject">${escapeHtml(entry.subject)}</span>
        <span class="history-hash">${escapeHtml(entry.hash)}</span>
      `;
      els.historyList.appendChild(li);
    });
    els.historyDrawer.hidden = false;
  } catch (error) {
    els.chapterStatus.textContent = `History unavailable: ${error.message}`;
  }
}

function closeHistory() {
  els.historyDrawer.hidden = true;
}

/* -------------------------------------------------------------- wiring ---- */

els.reloadChaptersBtn.addEventListener("click", async () => {
  await loadChapters();
  if (state.selectedChapterPath) {
    await loadSelectedChapter();
  }
});
els.applyBtn.addEventListener("click", applyEdits);
els.promoteBtn.addEventListener("click", promoteChapter);
els.historyBtn.addEventListener("click", openHistory);
els.closeHistoryBtn.addEventListener("click", closeHistory);
els.clearBtn.addEventListener("click", clearDecisions);

loadChapters().catch((error) => {
  els.emptyState.innerHTML = `<p class="muted">Could not load chapters: ${escapeHtml(
    error.message
  )}</p>`;
});
