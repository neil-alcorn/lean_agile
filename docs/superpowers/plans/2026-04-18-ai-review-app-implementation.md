# AI Review App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first browser review app that compares canonical Markdown chapters against proposed revisions or imported `.docx` content, lets the user accept or reject change blocks, writes approved content back to source, and rebuilds the manuscript.

**Architecture:** Create a small Node-based local app in `review-app/` with an Express API and a static browser UI. The backend reads chapter files, imports `.docx` through Mammoth, computes block-level diffs, applies accept/reject decisions into a merged result, writes the updated chapter file, and triggers the existing Python build script.

**Tech Stack:** Node.js, Express, Mammoth, static HTML/CSS/JS frontend, Python build tool, `node:test`

---

### Task 1: Scaffold the review app

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\package.json`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\server.js`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\index.html`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\app.js`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\styles.css`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\tests\review-app.test.js`

- [ ] **Step 1: Create the directory tree**
- [ ] **Step 2: Add a package file with `start` and `test` scripts**
- [ ] **Step 3: Add placeholder server and browser files**

### Task 2: Write failing tests for review logic

**Files:**
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\tests\review-app.test.js`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\lib\review-logic.js`

- [ ] **Step 1: Write tests for block diff generation**
- [ ] **Step 2: Write tests for applying accept/reject decisions**
- [ ] **Step 3: Write tests for front matter preservation**
- [ ] **Step 4: Run tests to verify they fail**

### Task 3: Implement review logic

**Files:**
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\lib\review-logic.js`

- [ ] **Step 1: Parse Markdown into front matter and body**
- [ ] **Step 2: Split bodies into reviewable paragraph blocks**
- [ ] **Step 3: Generate a line/paragraph diff between current and proposed**
- [ ] **Step 4: Apply per-block decisions to produce merged Markdown**
- [ ] **Step 5: Run tests to verify they pass**

### Task 4: Implement the backend API

**Files:**
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\server.js`
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\lib\book-files.js`

- [ ] **Step 1: Add chapter-library endpoint**
- [ ] **Step 2: Add proposal-import endpoint for pasted text**
- [ ] **Step 3: Add `.docx` import endpoint using Mammoth**
- [ ] **Step 4: Add compare endpoint that returns diff blocks**
- [ ] **Step 5: Add apply endpoint that writes approved content back to chapter Markdown**
- [ ] **Step 6: Add build endpoint that triggers `book/tools/build_book.py build`**

### Task 5: Implement the browser review UI

**Files:**
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\index.html`
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\app.js`
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\public\styles.css`

- [ ] **Step 1: Build chapter library view**
- [ ] **Step 2: Build proposal intake controls for pasted text and local `.docx`**
- [ ] **Step 3: Build side-by-side review pane**
- [ ] **Step 4: Add per-block accept/reject/revise controls**
- [ ] **Step 5: Add merged-preview panel**
- [ ] **Step 6: Add rebuild action and status display**

### Task 6: Add docs and repo integration

**Files:**
- Create: `C:\Users\nalco\OneDrive\Lean and Agile\review-app\README.md`
- Modify: `C:\Users\nalco\OneDrive\Lean and Agile\book\README.md`

- [ ] **Step 1: Document install and run flow**
- [ ] **Step 2: Explain the review workflow**
- [ ] **Step 3: Document how `.docx` intake maps back to canonical chapters**

### Task 7: Verify the app end to end

**Files:**
- No new files required

- [ ] **Step 1: Run backend tests**
- [ ] **Step 2: Start the local review server**
- [ ] **Step 3: Load the app in a browser**
- [ ] **Step 4: Compare a real chapter against a proposal**
- [ ] **Step 5: Apply a change and rebuild the manuscript**

