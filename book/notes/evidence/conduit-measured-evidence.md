# Evidence File — Measured Material from the Author's Own Delivery System

**Status: not manuscript prose.** This is a sourced evidence bank for the chapters the editorial
backlog identifies as thin. Every figure was derived from primary artifacts (`convoy.yaml`,
`events.jsonl`, git logs, engineering memory files) on 2026-08-03, not from recollection.

**Why this file exists.** `editorial-feedback.md` has been asking for a measurement chapter, a
measurable link for the hidden factory, an Agile measurement section, and an ITIL worked example.
The author has all four already, measured, in a system he built and ran for four months. The book
currently asserts what good practice looks like; this material shows it happening, including where
it failed.

**Provenance and staleness.** Historical measurements on a dated run are safe to cite indefinitely.
Anything describing *current state* must be re-derived — the source repository drifted twice within
four hours while this was being compiled. Full derivations and caveats:
`Conduit Machine AB Test\context-transfer\qa\CONDUIT-HISTORY-AND-MILESTONES.md`.

---

## The strongest single fact available to this book

Delivery cycle time, measured `created_date → released_at` across **110 completed units of work**,
before and after a July 2026 architectural restructure:

| Era | n | median | mean |
| --- | --- | --- | --- |
| Apr – Jun 2026 | 45 | **6.76 days** | 12.42 days |
| 1 – 15 Jul 2026 | 36 | **2.64 days** | 3.29 days |
| 16 Jul – 3 Aug 2026 | 29 | **2.65 days** | 3.32 days |

**Why this is unusually citable:** the metric is defined identically on both sides, the intervention
is independently dated, n is large enough to be more than anecdote, and the improvement held across
two consecutive later windows rather than appearing once.

**The detail that makes it a Lean point rather than a productivity boast:** the *mean* fell 12.42 →
3.29 while the *median* fell only 6.76 → 2.64. The long tail collapsed harder than the middle. That
is the signature of **removed blockage**, not faster work — which is precisely Lean's claim about
flow, and it is visible in the arithmetic rather than asserted.

Whole-portfolio distribution, for the percentile discussion the backlog requests:
min 0.57 d · **p25 1.90 d · median 3.71 d · p75 6.75 d · p90 13.85 d** · max 49.89 d · mean 7.04 d.

Note the mean (7.04) sits near the 78th percentile. **An average would have described almost nobody's
experience** — the concrete case for percentiles the backlog asks for at item 7.

*Caveat to state if used: `created_date` is date-only, so sub-day figures carry ±1 day error.*

---

## Chapter 01 — the hidden factory, with the measurable link it needs

`editorial-feedback.md` asks for "a measurable rework-rate formula" and "a practical threshold."

**Measured rework rate: 35 rejections across 184 units of work — 11%.** Concentrated almost entirely
in the two review gates that require a second human: implementation **22**, security **11**. The
other seven gates produced 2 rejections between them.

The rejection reasons are the hidden factory in the author's own words. Each is a real, dated event:

- *"Implementation commits not present on master; routes still mock-backed; **25 tests on master, not 87**"*
- *"4 security fixes are **unstaged — not present in committed code**"*
- *"`npm audit` shows **2 HIGH in production path** — contradicts the 0 HIGH/CRITICAL claim"*
- *"AC test-coverage claims **do not match test files — five ACs lack any test**"*
- *"**doctor accepts placeholder `YOUR_BEACON_API_KEY`** as a configured key"*

Every one is work that was reported finished and was not. That is the hidden factory — not a
metaphor, a log.

**Rework scoring rule worth quoting** (from the author's engineering metrics): reopened work earns
**zero** points, not negative — *"negative scoring discourages honest reopening of defective work."*
This is the cleanest Deming-consistent metric design in the author's corpus: the rule is shaped so
that honesty is never penalised. It belongs in Chapter 01 or 04 as a worked example of designing a
measure that cannot be gamed into dishonesty.

---

## Chapters 04 and 05 — measurement, and why averages mislead

Beyond the percentile table above, two series usable directly:

**Throughput as a real series** rather than a velocity abstraction. Units created per month:
Apr 47 · May 35 · Jun 18 · **Jul 82** · Aug 2. Released per month: Apr 2 · May 17 · Jun 22 · **Jul 65**
· Aug 4. Total lifetime: 112 released, 38 closed, 13 withdrawn, 20 active.

**Test-suite growth, dated** — for Chapter 12's learning metrics as much as Chapter 05:
engine 350 tests (4 May) → 675 (8 Jul) → 886 (13 Jul) → **1,397 (30 Jul)**; application 1,345 →
2,458 (28 Jul) → **2,970 (3 Aug)**.

**A caution the book should carry rather than hide.** A throughput claim of "2–3 units a day" exists
in the author's notes and is **derived from the process model, not measured** — it follows from the
minimum of two human review touchpoints. The measured proxy is the released-per-month series. Stating
this distinction in the text would model the discipline the book preaches: a number derived from a
model is not a number observed in the world.

---

## Chapter 06 — the ITIL worked example, using service-level shape

The backlog asks for MTTR, change success rate, and availability. What exists instead is better
suited to the book's actual argument: **1,195 measured review-gate latencies**, which behave exactly
like a service-level distribution.

| Gate | n | median | mean | p90 | max | over 1 h | over 24 h |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Intake | 148 | 0.007 h | 0.29 h | 0.25 h | 11.3 h | 4 | 0 |
| 1 Requirements | 145 | 0.006 h | 0.24 h | 0.22 h | 11.5 h | 5 | 0 |
| 2 Design | 144 | 0.006 h | 0.21 h | 0.17 h | 12.0 h | 4 | 0 |
| **3 Implementation (2 humans)** | 127 | **0.179 h** | **6.61 h** | 13.49 h | **259.4 h** | **41** | **7** |
| 4 Unit QA | 132 | 0.007 h | 0.08 h | 0.12 h | 2.0 h | 4 | 0 |
| **5 Security (2 humans)** | 125 | **0.049 h** | **3.87 h** | 3.17 h | **92.9 h** | **24** | **4** |
| 6 Regression QA | 125 | 0.006 h | 0.08 h | 0.11 h | 2.8 h | 2 | 0 |
| 7 Comms | 117 | 0.004 h | 0.01 h | 0.02 h | 0.3 h | 0 | 0 |
| 8 Release | 132 | 0.001 h | 0.70 h | 0.05 h | 43.9 h | 5 | 2 |

**The two gates requiring a second human account for 65 of the 89 holds over an hour, and 11 of the
13 over a day.** Every machine-evaluable gate clears in seconds.

This is the empirical shape of a constraint, and it is honest in a way most AI-and-process writing is
not: **automation made the automatable steps effectively free and left the human steps exactly where
they were.** The bottleneck did not move. It became more visible.

⚠ **Required caveat if any of these numbers are printed.** The request→approval delta mostly measures
*how long recording took*, not how long reviewing took — median 25 seconds. What survives is the
**shape** (which gates have fat tails), not the absolute values. One directly measured review
duration exists: a security gate that ran **3 h 39 m** across two council rounds. It was the figure
that refuted an earlier inference that gates were being rubber-stamped, drawn from 3–4 second
timestamp deltas. **Timing is not evidence of review depth** — a sentence the book could use verbatim.

---

## Chapter 03 — speak-up culture, evidenced rather than asserted

The strongest material is that **peer reviewers rejected the author's own work, in writing, and the
rejections are preserved with their names attached.** Seven of the verbatim reasons above were
produced by peers reviewing work the author was accountable for.

Two structural details worth the chapter:

1. **A second session run by the same person cannot supply the second pair of eyes.** The rule is
   enforced in code, not policy. It is a concrete answer to "how do you make review real rather than
   ceremonial."
2. **The author's own tooling was the subject of two defect reports from a direct report**, who was
   explicitly designated as the feedback partner — one finding that the tool "documents a credential
   path that does not exist," another that its output was unusable in the target system. The author
   wrote both up against himself: *"A documented capability that isn't real cost a user a session.
   Worse than a missing feature, because it burns trust in the docs generally."*

**And the honest counterweight, which the chapter needs more than the success stories:** of roughly
eleven people reviewed in the same period, **eight offered no upward feedback at all**, each recorded
identically as *"none offered — ask directly."* The author's own philosophy supplies the diagnosis:
*"Low psychological safety produces hiding."* A speak-up chapter that includes this is far more
credible than one that does not.

---

## Chapters 10 and 11 — the AI material these chapters currently lack entirely

Both chapters presently argue that AI should augment rather than replace, using hypothetical
examples. The following are real.

### The 31-round council — a documented strategy failure

One implementation gate accumulated **106 audit files**, including council findings rounds **1
through 31**. Round 1 sent the work back. **Rounds 19 through 29 sat flat at 3–5 send-backs**, with
blocking-finding counts of 5, 9, 5, 14, 12, 6, 7 — **no convergence trend**. Round 31 approved
unanimously across five named seats.

The recorded verdict is the chapter's counterintuitive insight, already written:
***"A council that cycles 20+ rounds is a strategy error, not a defect backlog."***

Compare a healthy instance: three rounds, four seats, where in round 2 the adversarial seat caught
that **the proposed fix was itself invalid** on protocol grounds. Outcome: the work was descoped
rather than shipped. More review is not better review; convergence is the signal.

### A measured false-positive rate for AI review

**Five of six reported defects in one analysis were documented, intentional configuration** — with
the explanatory notes sitting in the file the analysis had read. Recorded conclusion: *"anomaly
detection over outputs generates plausible-sounding defects at a high rate."* The single real defect
was found by reading the configuration, not by scanning the output.

Two further findings were **retracted** because the tooling manufactured them: a report of "OCR
garbage in 141 documents" was ordinary CamelCase identifiers, and a report of corrupted characters in
titles was **zero** — *"my own ascii-safe print substituted legitimate em-dashes. My display
manufactured the finding."*

That is a rare, honest, measured statement about AI review precision, from someone with no incentive
to publish it.

### The green-signal corpus — the book's best AI-era argument

Nine documented cases where a passing signal concealed a failure:

| The reassuring signal | The reality |
| --- | --- |
| 1,345 tests green | A live data-integrity bug shipped; review attribution silently dropped |
| 58 tests passing | The page broke on every load — the tests mocked the database layer itself |
| 29/29 green **after deliberately deleting two security guards** | The mock discarded its arguments, so a "404" assertion only proved the fixture was empty |
| 9 tests green on an **inverted** predicate | And "mutation-verified" had been written into three artifacts |
| "Mutation-verified" timing test | The mutation lived *inside the test*; the shipped function had zero coverage |
| Pipeline SUCCEEDED, twice, 4 minutes apart | Production served a **three-hour-old** build; a whole work unit was absent while the tracker said "deployed" |
| A review reporting **"Total findings: 0 — Pass"** | All six reviewer agents were still `pending`. It had not run. |
| `npm run check` exit 0 | Piped through `tail`, which exits 0. The real tool exits 1 and reported 262 errors. |
| A build reporting `killed` | It had **succeeded** — 12 m 39 s, output written. The status lied in the opposite direction. |

**The unifying formulation, from the author's own notes:** *"a green indicator answers a narrower
question than the one being asked."*

This is what Chapter 10 is groping toward with its auto-generated-performance-review scene, and it is
vastly stronger because it is documented. It also generalises beyond software: the pattern is a
**proxy measure being trusted at a scope wider than it covers** — which is Deming on inspection, and
Goodhart on targets, arriving via a build log.

### The finding that should be the chapter's spine

From an analysis of nine engineers' AI usage: **premature confidence appeared in 8 of 9**, including
the author himself (declaring a deployment done from a green pipeline). The recorded conclusion:

> *"The uncomfortable finding: the team's quality control currently depends on individual skepticism,
> and skepticism is unevenly distributed."*

And the consequent argument for structure over exhortation — *"That is precisely the case for making
evidence discipline structural rather than personal"* — is Deming's central claim, rediscovered from
telemetry rather than inherited from a textbook. **That is the book's thesis, proven on the author's
own team, with the author in the defect list.**

---

## Chapter 12 — learning metrics, with a real mechanism

The backlog asks for defined formulas. The more useful contribution is a **mechanism that was
observed working on exactly one person**:

> *"He makes the tool write every correction back into the project instructions so it never recurs.
> That is the exact behavior the rest of the team is missing."*

Promoted to a standing rule: *"recurring friction does not get fixed, it gets **promoted** to a
guardrail — a baseline rule or a hook. A lesson that stays conversational gets re-learned."*

The candid pairing: the author's own usage analysis records of himself — *"Recurring lessons stay
conversational instead of becoming enforced rules."* The rule and the violation, same corpus, same
author. A learning-organisation chapter that admits this is worth more than one that defines
formulas.

Measurable proxies that do exist: the dated test-count series above, and **the count of lessons
converted into enforced rules versus lessons recorded as prose** — a learning metric the book could
propose because someone has actually tried to hold it.

---

## Boundaries — what this evidence cannot support

Stated plainly so nothing here gets over-claimed in the manuscript:

- **No cost or token telemetry series exists.** 14 usage events across 184 units; the one with
  numbers is self-labelled an estimate.
- **No defect-escape rate.** Escapes are documented individually; there is no denominator.
- **No lead time** from idea to work start — no intake date precedes creation.
- **No per-stage cycle time.** Computable in principle, deliberately not computed: 42 units have no
  gate history and 101 skipped gates muddy the boundaries.
- **No measured predictability, rework percentage, or critical-defect count** in the team metrics
  system. The targets are defined; the actuals were never collected.
- **The value pilot was never run.** A falsification threshold was pre-declared and the experiment
  never executed. *"Plumbing exists; proof does not."* — which is itself an honest line about
  measurement theatre, if the book wants it.

---

## The methodological finding worth a section of its own

Nine of the most consequential numbers in this corpus are measurements of **a signal being wrong**:
267→266 · 15,313 vs 15,313 · 84-of-87 · 29/29-after-deletion · 58-green-on-a-broken-page ·
9-green-on-an-inversion · 43-vs-128 · 17-vs-42 · a 0-byte backup of a repository reporting "clean".

**The numbers that mattered most were the ones that didn't move when they should have.**

For a book arguing that quality is built rather than inspected, that sentence is the thesis in
measurable form — and it was earned, not borrowed.
