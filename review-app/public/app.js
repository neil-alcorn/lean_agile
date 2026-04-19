const state = {
  chapters: [],
  selectedChapterPath: "",
  selectedChapterContent: "",
  proposalText: "",
  reviewBlocks: [],
  decisions: {},
};

const els = {
  chapterList: document.getElementById("chapterList"),
  proposalText: document.getElementById("proposalText"),
  docxFile: document.getElementById("docxFile"),
  docxStatus: document.getElementById("docxStatus"),
  compareBtn: document.getElementById("compareBtn"),
  currentContent: document.getElementById("currentContent"),
  proposedContent: document.getElementById("proposedContent"),
  reviewBlocks: document.getElementById("reviewBlocks"),
  mergedPreview: document.getElementById("mergedPreview"),
  applyBtn: document.getElementById("applyBtn"),
  buildStatus: document.getElementById("buildStatus"),
  buildBtn: document.getElementById("buildBtn"),
  usePastedTextBtn: document.getElementById("usePastedTextBtn"),
  reloadChaptersBtn: document.getElementById("reloadChaptersBtn"),
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

function renderChapterList() {
  els.chapterList.innerHTML = "";
  state.chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = `chapter-item${state.selectedChapterPath === chapter.path ? " active" : ""}`;
    button.innerHTML = `
      <strong>${chapter.chapter}. ${escapeHtml(chapter.title)}</strong>
      <span>${escapeHtml(chapter.path)}</span>
    `;
    button.addEventListener("click", async () => {
      state.selectedChapterPath = chapter.path;
      const result = await api(`/api/chapter?path=${encodeURIComponent(chapter.path)}`);
      state.selectedChapterContent = result.content;
      els.currentContent.textContent = result.content;
      renderChapterList();
      updateCompareEnabled();
    });
    els.chapterList.appendChild(button);
  });
}

function updateCompareEnabled() {
  els.compareBtn.disabled = !(state.selectedChapterPath && state.proposalText.trim());
}

function renderReviewBlocks() {
  els.reviewBlocks.innerHTML = "";

  if (!state.reviewBlocks.length) {
    els.reviewBlocks.innerHTML = "<p class='muted'>No differences detected.</p>";
    els.applyBtn.disabled = true;
    return;
  }

  state.reviewBlocks.forEach((block) => {
    const wrapper = document.createElement("article");
    wrapper.className = "review-block";
    const decision = state.decisions[block.id] || "reject";

    wrapper.innerHTML = `
      <div class="review-block-header">
        <strong>${escapeHtml(block.type.toUpperCase())}</strong>
        <div class="decision-group">
          <button data-action="accept" class="${decision === "accept" ? "selected" : ""}">Accept</button>
          <button data-action="reject" class="${decision === "reject" ? "selected" : ""}">Reject</button>
          <button data-action="revise" class="${decision === "revise" ? "selected" : ""}">Revise</button>
        </div>
      </div>
      <div class="review-columns">
        <div>
          <h4>Current</h4>
          <pre>${escapeHtml(block.currentText || "[empty]")}</pre>
        </div>
        <div>
          <h4>Proposed</h4>
          <pre>${escapeHtml(block.proposedText || "[empty]")}</pre>
        </div>
      </div>
    `;

    wrapper.querySelectorAll("button[data-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        state.decisions[block.id] = button.dataset.action;
        await refreshMergedPreview();
        renderReviewBlocks();
      });
    });

    els.reviewBlocks.appendChild(wrapper);
  });

  els.applyBtn.disabled = false;
}

async function refreshMergedPreview() {
  if (!state.selectedChapterPath || !state.proposalText.trim()) {
    els.mergedPreview.textContent = "";
    return;
  }

  const payload = await api("/api/compare", {
    method: "POST",
    body: JSON.stringify({
      chapterPath: state.selectedChapterPath,
      proposedText: state.proposalText,
    }),
  });

  state.reviewBlocks = payload.reviewBlocks;
  els.currentContent.textContent = payload.currentContent;
  els.proposedContent.textContent = payload.proposedText;

  const merged = await api("/api/apply", {
    method: "POST",
    body: JSON.stringify({
      chapterPath: state.selectedChapterPath,
      proposedText: state.proposalText,
      decisions: state.decisions,
      previewOnly: true,
    }),
  }).catch(async () => {
    return {
      mergedContent: payload.mergedContent,
    };
  });

  els.mergedPreview.textContent = merged.mergedContent || payload.mergedContent;
}

async function loadChapters() {
  const result = await api("/api/chapters");
  state.chapters = result.chapters;
  renderChapterList();
}

async function compareSelected() {
  state.decisions = {};
  const payload = await api("/api/compare", {
    method: "POST",
    body: JSON.stringify({
      chapterPath: state.selectedChapterPath,
      proposedText: state.proposalText,
    }),
  });
  state.reviewBlocks = payload.reviewBlocks;
  els.currentContent.textContent = payload.currentContent;
  els.proposedContent.textContent = payload.proposedText;
  els.mergedPreview.textContent = payload.currentContent;
  renderReviewBlocks();
  await refreshMergedPreview();
}

async function importDocx(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 = btoa(binary);

  const result = await api("/api/proposal/docx", {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      data: base64,
    }),
  });

  state.proposalText = result.text;
  els.proposalText.value = result.text;
  els.docxStatus.textContent = `Imported ${file.name}`;
  updateCompareEnabled();
}

async function applyApprovedChanges() {
  const result = await api("/api/apply", {
    method: "POST",
    body: JSON.stringify({
      chapterPath: state.selectedChapterPath,
      proposedText: state.proposalText,
      decisions: state.decisions,
    }),
  });

  els.currentContent.textContent = result.mergedContent;
  els.mergedPreview.textContent = result.mergedContent;
  els.buildStatus.textContent = `Saved approved changes to ${state.selectedChapterPath}`;
}

async function rebuildBook() {
  els.buildStatus.textContent = "Rebuilding book...";
  const result = await api("/api/build", { method: "POST", body: JSON.stringify({}) });
  els.buildStatus.textContent = result.ok
    ? `Build complete. Outputs: ${result.outputs.docx} and ${result.outputs.markdown}`
    : `Build failed: ${result.stderr || result.stdout || "unknown error"}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

els.usePastedTextBtn.addEventListener("click", async () => {
  const result = await api("/api/proposal/text", {
    method: "POST",
    body: JSON.stringify({ text: els.proposalText.value }),
  });
  state.proposalText = result.text;
  updateCompareEnabled();
  els.docxStatus.textContent = "Using pasted text proposal.";
});

els.compareBtn.addEventListener("click", compareSelected);
els.applyBtn.addEventListener("click", applyApprovedChanges);
els.buildBtn.addEventListener("click", rebuildBook);
els.reloadChaptersBtn.addEventListener("click", loadChapters);
els.docxFile.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  await importDocx(file);
});

loadChapters().catch((error) => {
  els.buildStatus.textContent = error.message;
});
