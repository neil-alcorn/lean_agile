# Chapter 1 Integration and Chapter 2 Editorial Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Melissa's latest Chapter 1 wording and apply her established editorial style to the Chapter 2 Edit Copy without changing either canonical Book Copy.

**Architecture:** The canonical chapters in `book/chapters/` remain untouched. Editorial changes are confined to the corresponding files in `book/drafts/chapters/`, while review status is maintained through the Editing Desk session API. Verification combines exact-text checks, manuscript diffs, book validation, and existing automated tests.

**Tech Stack:** Markdown manuscripts, JSON review sessions, Node.js Editing Desk, Python book builder, Git diff.

---

### Task 1: Integrate Melissa's Deming Edits

**Files:**
- Modify: `book/drafts/chapters/01-deming-s-legacy-the-14-points-and-their-modern-application-in-it.md`
- Preserve: `book/chapters/01-deming-s-legacy-the-14-points-and-their-modern-application-in-it.md`

- [ ] **Step 1: Capture the current live review session**

POST `{"chapterPath":"book/chapters/01-deming-s-legacy-the-14-points-and-their-modern-application-in-it.md"}` to `/api/compare` and retain the exact `editedText` values for blocks 48 and 51.

- [ ] **Step 2: Replace the two paragraphs in the Edit Copy**

Use Melissa's saved wording exactly:

```markdown
Deming’s story contains an irony worth remembering. He was an American physicist and statistician who worked with the U.S. government and industry. But American management did not broadly embrace the system of leadership behind his methods. In 1950, the Japanese Union of Scientists and Engineers invited him to Japan, where he taught engineers and senior executives that quality was a management responsibility and had to be designed into the entire system, not inspected into a finished product.
```

```markdown
It would be too simple to call Deming Japan’s single secret sauce or to credit him with inventing the Toyota Production System. Toyota’s just-in-time and jidoka traditions had their own roots. But Deming helped strengthen the management philosophy around quality, variation, learning, and systems thinking that made those practices more powerful. The lesson is that useful ideas create value only when leaders are humble enough to listen and disciplined enough to act.
```

- [ ] **Step 3: Clear the resolved annotations**

Save the review session without blocks 48 and 51. Preserve block 16, its original fishbone note, and its `pending` status.

- [ ] **Step 4: Verify Chapter 1 state**

Confirm the Edit Copy contains both exact paragraphs, the Book Copy is unchanged, accepted count is zero, flagged count is zero, and the fishbone note remains pending.

### Task 2: Apply Melissa's Style to Chapter 2

**Files:**
- Modify: `book/drafts/chapters/02-why-management-owns-the-process-but-employees-own-the-results.md`
- Reference: `book/notes/chapter-1-reviewer-style-patterns.md`
- Preserve: `book/chapters/02-why-management-owns-the-process-but-employees-own-the-results.md`

- [ ] **Step 1: Establish the baseline**

Record the Edit Copy's paragraph count, heading count, and em-dash count. Read the entire chapter before editing so repeated ideas can be evaluated across sections rather than sentence by sentence.

- [ ] **Step 2: Edit the opening and leadership sections**

Retain Mike's story and conversational humor. Replace decorative em dashes with periods, commas, colons, semicolons, or parentheses according to meaning. Tighten repeated explanations of executive sponsorship, managerial process ownership, and employee results ownership.

- [ ] **Step 3: Edit the methodology comparison**

Preserve Lean, Agile, and ITIL as separate structured entries. Repair the malformed Lean tools sentence, remove repeated Agile “fail fast” explanations, and simplify formulaic transitions without adding new methodological claims.

- [ ] **Step 4: Edit empowerment and closing sections**

Repair missing punctuation and agreement errors, especially the micromanagement paragraph and “employees that are striving” construction. Shorten repeated ownership conclusions while preserving the distinction among executive direction, management structure, and employee agency.

- [ ] **Step 5: Edit reflection questions**

Retain all substantive reflection dimensions. Remove only redundant wording; do not answer the questions or add new subject matter.

- [ ] **Step 6: Review the complete diff**

Reject any change that makes the voice more academic, removes earned humor, changes the management/employee responsibility model, or introduces a factual claim. Confirm every paragraph still advances one clear idea.

- [ ] **Step 7: Confirm review behavior**

Load Chapter 2 through `/api/compare`. Confirm changes appear as pending differences and no blocks are marked accepted or promoted.

### Task 3: Verify the Editorial Pass

**Files:**
- Validate: `book/config/book.json`
- Test: `book/tests/test_build_book.py`
- Test: `review-app/tests/review-app.test.js`

- [ ] **Step 1: Validate the book**

Run:

```powershell
& "C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" book\tools\build_book.py validate
```

Expected: `No validation issues detected.`

- [ ] **Step 2: Run book tests**

Run:

```powershell
& "C:\Users\nalco\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m unittest book.tests.test_build_book -v
```

Expected: four tests pass.

- [ ] **Step 3: Run Editing Desk tests**

Run from `review-app/`:

```powershell
npm test
```

Expected: all review-app tests pass.

- [ ] **Step 4: Inspect repository scope**

Run `git status --short` and `git diff --check`. Confirm neither canonical chapter is modified and do not commit the pending Edit Copy changes.
