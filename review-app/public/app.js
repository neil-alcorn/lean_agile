const state = {
  chapters: [],
  selectedChapterPath: "",
  alignedBlocks: [],
  assets: {},
  session: { blocks: [] },
  openBlockId: "",
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
  manuscriptBody: document.getElementById("manuscriptBody"),
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
  return title;
}

function peekSessionBlock(blockId) {
  const found = (state.session.blocks || []).find((block) => block.id === blockId);
  if (found && found.status === "needs_ai_revision") found.status = "flagged";
  return found || null;
}

function getSessionBlock(blockId) {
  const found = peekSessionBlock(blockId);
  if (found) return found;
  const fresh = { id: blockId, status: "pending", note: "", editedText: "" };
  state.session.blocks.push(fresh);
  return fresh;
}

function hasAnnotation(sessionBlock) {
  if (!sessionBlock) return false;
  return (
    (sessionBlock.status && sessionBlock.status !== "pending") ||
    (sessionBlock.note || "").trim() !== "" ||
    (sessionBlock.editedText || "").trim() !== ""
  );
}

function changedBlocks() {
  return (state.alignedBlocks || []).filter((b) => b.changed);
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
        blocks: (state.session.blocks || []).filter(hasAnnotation),
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
    button.innerHTML = `
      <span class="chapter-no">${escapeHtml(chapterLabel(chapter))}</span>
      <span class="chapter-name">${escapeHtml(shortTitle(chapter))}</span>
    `;
    button.addEventListener("click", async () => {
      state.selectedChapterPath = chapter.path;
      state.openBlockId = "";
      closeHistory();
      await loadSelectedChapter();
      renderChapterList();
      window.scrollTo({ top: 0 });
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
  state.alignedBlocks = result.alignedBlocks || [];
  state.assets = result.assets || state.assets || {};
  if (result.reviewSession) {
    state.session = result.reviewSession;
  } else {
    state.session = { chapterPath: state.selectedChapterPath, blocks: [] };
  }
  els.chapterStatus.textContent = "";
  renderManuscript();
}

/* ------------------------------------------------------------ figures ---- */

const VISUAL_RE = /<!--\s*VISUAL:\s*[\w.-]+\s*\|\s*id:([\w.-]+)[\s\S]*?-->/g;
const FIGURE_SLOT_RE = /<!--\s*FIGURE_SLOT:\s*([\w.-]+)\s*-->/g;
const EDITORIAL_RE = /<!--\s*EDITORIAL_NOTE:\s*([\s\S]*?)-->/g;

function figureHtml(assetId) {
  const asset = state.assets[assetId];
  if (!asset || !asset.src) {
    return `<span class="figure-missing">[figure &ldquo;${escapeHtml(assetId)}&rdquo; is not registered yet]</span>`;
  }
  return `
    <span class="figure-embed">
      <img src="${escapeHtml(asset.src)}" alt="${escapeHtml(asset.caption || assetId)}" loading="lazy" />
      <span class="figure-caption">${escapeHtml(asset.caption || "")}</span>
      <span class="figure-id">${escapeHtml(assetId)}</span>
    </span>`;
}

function decorateCellHtml(escapedOrDiffHtml, rawText) {
  let html = escapedOrDiffHtml;
  html = html.replaceAll(
    /&lt;!--\s*(?:VISUAL|FIGURE_SLOT):[\s\S]*?--&gt;/g,
    ""
  );
  html = html.replaceAll(
    /&lt;!--\s*EDITORIAL_NOTE:\s*([\s\S]*?)--&gt;/g,
    '<span class="editorial-note">Editorial note: $1</span>'
  );
  const figures = [];
  for (const match of rawText.matchAll(VISUAL_RE)) figures.push(match[1]);
  for (const match of rawText.matchAll(FIGURE_SLOT_RE)) figures.push(match[1]);
  for (const id of figures) {
    html += figureHtml(id);
  }
  return html;
}

/* --------------------------------------------------------- manuscript ---- */

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  flagged: "Flagged",
};

function renderManuscript() {
  els.manuscriptBody.innerHTML = "";
  const blocks = state.alignedBlocks || [];
  const changed = changedBlocks();
  let changeNumber = 0;

  blocks.forEach((block) => {
    const sessionBlock = peekSessionBlock(block.id);
    const annotated = hasAnnotation(sessionBlock);
    const status = sessionBlock?.status || "pending";
    const isOpen = state.openBlockId === block.id;

    let rowClass;
    let tag = "";
    if (block.changed) {
      changeNumber += 1;
      rowClass = `ms-row changed status-${status}`;
      tag = `<span class="change-tag chip-${status}">${changeNumber}. ${STATUS_LABELS[status]}</span>`;
    } else if (annotated) {
      rowClass = `ms-row same annotated status-${status}`;
      const label = status === "flagged" ? "Flagged" : status === "accepted" ? "Edited" : "Note";
      tag = `<span class="change-tag chip-${status === "pending" ? "note" : status}">${label}</span>`;
    } else {
      rowClass = "ms-row same quiet";
    }
    if (isOpen) rowClass += " open";

    const row = document.createElement("div");
    row.className = rowClass;

    const pair = document.createElement("div");
    pair.className = "ms-pair";
    pair.title = isOpen
      ? "Click to close the editor"
      : block.changed
        ? "Click to edit this change"
        : "Click to comment or edit this paragraph";

    const leftHtml = block.changed
      ? block.currentHtml || "<span class='ghost'>not in Book Copy</span>"
      : escapeHtml(block.currentText);
    const rightHtml = block.changed
      ? block.editHtml || "<span class='ghost'>removed in Edit Copy</span>"
      : escapeHtml(block.proposedText);

    pair.innerHTML = `
      <div class="ms-cell">${decorateCellHtml(leftHtml, block.currentText || "")}</div>
      <div class="ms-cell">${decorateCellHtml(rightHtml, block.proposedText || "")}</div>
      ${tag}
    `;
    pair.addEventListener("click", () => {
      state.openBlockId = isOpen ? "" : block.id;
      renderManuscript();
      if (!isOpen) {
        const opened = document.getElementById(`editor-${block.id}`);
        opened?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        opened?.querySelector("textarea")?.focus();
      }
    });
    row.appendChild(pair);

    if (isOpen) {
      row.appendChild(buildEditor(block, sessionBlock || getSessionBlock(block.id)));
    }

    els.manuscriptBody.appendChild(row);
  });

  updateSummary(changed);
  updateToolbar(changed);
}

function buildEditor(block, sessionBlock) {
  const editor = document.createElement("div");
  editor.className = "ms-editor";
  editor.id = `editor-${block.id}`;
  editor.innerHTML = `
    <label class="field">
      <span>Your wording <span class="muted">(starts from the Edit Copy)</span></span>
      <textarea data-role="editedText" rows="5">${escapeHtml(
        sessionBlock.editedText || block.proposedText || ""
      )}</textarea>
    </label>
    <div class="editor-foot">
      <div class="decision-group">
        <button data-action="accepted" class="accept-btn${
          sessionBlock.status === "accepted" ? " selected" : ""
        }">Accept</button>
        <button data-action="flagged" class="flag-btn${
          sessionBlock.status === "flagged" ? " selected" : ""
        }">Flag for review</button>
      </div>
      <label class="field note-field">
        <span class="muted">Note (for the AI pass, reasons, or delete requests)</span>
        <textarea data-role="note" rows="1">${escapeHtml(sessionBlock.note || "")}</textarea>
      </label>
    </div>
  `;

  editor.addEventListener("click", (event) => event.stopPropagation());

  editor.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const sb = getSessionBlock(block.id);
      sb.status = sb.status === button.dataset.action ? "pending" : button.dataset.action;
      const textarea = editor.querySelector('[data-role="editedText"]');
      if (
        sb.status === "accepted" &&
        textarea.value.trim() !== (block.proposedText || "").trim()
      ) {
        sb.editedText = textarea.value;
      }
      if (sb.status === "accepted") {
        state.openBlockId = "";
      }
      scheduleSave();
      renderManuscript();
    });
  });

  editor.querySelector('[data-role="editedText"]').addEventListener("input", (event) => {
    getSessionBlock(block.id).editedText = event.target.value;
    scheduleSave();
  });

  editor.querySelector('[data-role="note"]').addEventListener("input", (event) => {
    getSessionBlock(block.id).note = event.target.value;
    scheduleSave();
  });

  return editor;
}

function updateSummary(changed) {
  const changedIds = new Set(changed.map((b) => b.id));
  let sameNotes = 0;
  for (const sb of state.session.blocks || []) {
    if (!changedIds.has(sb.id) && hasAnnotation(sb)) sameNotes += 1;
  }
  const notesSuffix = sameNotes
    ? ` · ${sameNotes} note${sameNotes === 1 ? "" : "s"} on matching text`
    : "";

  if (!changed.length) {
    els.reviewSummary.textContent = `Book Copy and Edit Copy match — nothing to review.${notesSuffix}`;
    return;
  }
  let accepted = 0;
  let flagged = 0;
  for (const block of changed) {
    const sb = peekSessionBlock(block.id);
    if (sb?.status === "accepted") accepted += 1;
    if (sb?.status === "flagged") flagged += 1;
  }
  const pending = changed.length - accepted - flagged;
  els.reviewSummary.textContent = `${changed.length} changes · ${accepted} accepted · ${flagged} flagged · ${pending} pending${notesSuffix}`;
}

function updateToolbar(changed) {
  const allAccepted =
    changed.length > 0 &&
    changed.every((b) => peekSessionBlock(b.id)?.status === "accepted");
  els.promoteBtn.disabled = !allAccepted;
  els.promoteBtn.title = allAccepted
    ? "Copy the Edit Copy over the Book Copy."
    : changed.length === 0
      ? "Nothing to promote — the copies already match."
      : "Accept every change first.";
  els.applyBtn.disabled = changed.length === 0;
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
    state.openBlockId = "";
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
    state.openBlockId = "";
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
  state.openBlockId = "";
  renderManuscript();
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
