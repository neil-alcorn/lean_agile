# Citations, Corrections, and Claims To Retire

**Status: not manuscript prose.** A sourced reference bank for the manuscript, assembled 2026-08-03/04,
extended 2026-08-04 with the METR RCT (§5.2) and psychological safety (PART 7).

**Read the verification labels.** ✅ = verified from a primary source actually opened. 🟡 = verified only
from a named secondary source. ❌ = could not verify — **do not print**.

Several research passes were cut short by session limits. Sections marked **INCOMPLETE** were not
finished and should not be treated as exhaustive.

🔧 **How to keep working on this when web search is unavailable.** Search quota and paper quota are
separate. When `WebSearch` is exhausted, `WebFetch` still works on a known URL, and a fetched PDF is
saved to disk — from there `PyMuPDF` (installed) extracts the full text locally, which is **more
reliable than the fetch tool's own summary**. Both sources added on 2026-08-04 were obtained this way
after search was at 200/200. ⚠ And the reason to extract locally rather than trust the summary: asked
for the METR confidence interval, the fetch summary returned **"a slowdown of 3–11%"**, a figure that
does not appear anywhere in the paper. Quote from extracted text, never from a summary of a PDF.

---

## PART 1 — CLAIMS THE BOOK SHOULD RETIRE

Each of these is either unverifiable or misattributed. Every one appears widely in the process
literature, which is exactly why a book arguing for measurement discipline should not repeat them.

### 1.1 "The most powerful inhibitor to quality and productivity in the Western world" ❌

**Do not use.** Searched exhaustively: absent from the complete deming.org quote database (all 108
quotes enumerated), every deming.org page fetched, Wikiquote, and the dedicated
performance-appraisals.org Deming FAQ.

**It is almost certainly a corruption of a real sentence that uses "blow," not "inhibitor":**

> "The annual appraisal of performance, or the so-called merit system. Of all the forces of
> destruction that have beset American industry, this one has dealt the most powerful **blow**.
> It destroys people, our most important asset."

✅ Deming, "The Merit System: The Annual Appraisal: Destroyer of People," in *The Essential Deming*,
ed. Joyce Orsini (McGraw Hill, 2013), pp. 27–28, per deming.org.

### 1.2 "A defect in production costs 100× more to fix than in design" ❌

**The direction is well supported. The magnitude is folklore, and a US government primary source
proves it.**

NIST's own report reproduces Boehm's actual figures (NIST Table 1-5): **Boehm (1976) runs 0.2Y at
requirements to 15Y at installation testing** — roughly 12:1 from coding to installation testing, and
it stops before production. The 470X–880X numbers that resemble the folklore belong to **Baziuk
(1995)**, a different study.

And NIST's own escalation curve, Table 5-1, runs **1X → 30X** and is titled, verbatim,
**"(Example Only)."**

✅ RTI, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, NIST Planning Report
02-3, May 2002, Tables 1-5 and 5-1.

The most-reproduced version of this table cites an "IBM Systems Sciences Institute" study that
appears never to have been published — traced via Pressman's textbook to internal IBM course notes,
with no dataset ever produced. 🟡 (secondary reporting of Bossavit, *The Leprechauns of Software
Engineering*, Leanpub 2015, ch. 10 — chapter title ✅ verified, argument 🟡).

### 1.3 "$59.5 billion is the annual cost of software bugs in the US" ❌ — two errors

**It is not the cost of bugs.** It is the cost of an **inadequate infrastructure for software
testing** — a counterfactual about better tools and methods.

**And "$22.2 to $59.5 billion" is not a range.** Per NIST Tables ES-4 / 8-1: **$59.5B is the total
cost; $22.2B is the portion recoverable** through feasible improvements. The report's own executive
summary seeds this confusion by writing them as a range.

The report's own caveat, verbatim: ✅

> "because the national impact estimates presented in this section were developed from interviews
> with two sectors … representing 5 percent of the U.S. economy, these estimates should be considered
> **approximations only**."

### 1.4 The 1-10-100 rule ❌ — folklore

Attributed to Labovitz & Chang (1992), originally about *data* quality. No primary publication, no
dataset, no methodology located. The literature is actively inflating it to "10:100:1000" on no
evidence whatsoever. **Use only as a mnemonic for convexity, and say so.**

### 1.5 "Feigenbaum showed 40% of plant capacity is lost to the hidden factory" ❌

**The concept is sound and attributable. The number is not, and it is not from his book.**

The 20–40% figure traces to a **1994 trade-magazine interview**: 🟡 Stevens, T., "Dr. Armand
Feigenbaum on the Cost of Quality and the Hidden Factory," *Industry Week*, 4 July 1994. Secondary
sources give the range variously as 15–40%, 20–40%, and "up to 40%" — the spread is itself evidence
nobody is quoting an original. Feigenbaum's own term appears to have been "hidden **plant**."

Defensible sentence: *"Feigenbaum, in a 1994 Industry Week interview, put the hidden plant at 20–40%
of capacity — an estimate, not a measurement."*

### 1.6 The hidden factory has **two unrelated parents**, and citing the wrong one is common ✅

| | Feigenbaum | Miller & Vollmann |
| --- | --- | --- |
| Claim | capacity consumed by **rework** | overhead generated by **transaction volume** |
| Genre | quality-cost | management accounting (→ activity-based costing) |
| Source | 1994 *Industry Week* interview 🟡 | ✅ *HBR*, Sept–Oct 1985, reprint 85510 |

Miller & Vollmann's four transaction types are logistical, balancing, quality, and change — **rework
appears only as one sub-item inside one of four categories.** Citing the 1985 HBR article as the
source of "40% of capacity lost to rework" — which happens constantly — conflates two different
arguments and attributes a number to a paper that does not contain it.

### 1.7 Any Standish / CHAOS-derived statistic ❌ — refuted method

✅ Eveleens & Verhoef, "The Rise and Fall of the Chaos Report Figures," *IEEE Software*,
Jan/Feb 2010. They applied Standish's definitions to **5,457 forecasts of 1,211 real projects** and
concluded the definitions are "**misleading, one-sided, pervert the estimation practice, and result
in meaningless figures**" — because success is defined *solely* by adherence to an initial forecast,
and because they "**neglect underruns** for cost and time and overruns for the amount of
functionality." **Cite this paper whenever the book needs to dismiss a CHAOS number.**

### 1.8 "MTTR is an ITIL metric" ❌ — **it is not, and this is the strongest ITIL finding**

Exhaustive search of the official AXELOS *Incident management: ITIL 4 Practice Guide* (11 Jan 2020):
**"MTTR" 0 occurrences · "mean time" 0 · "mean" 0 · "average" 0 · "percentile" 0.** ✅

ITIL 4 instead prescribes **segmented intervals** — time between occurrence and detection, detection
to acceptance, time of diagnosis, waiting time as a share of handling time, number of reassignments,
first-time resolution rate — plus "**meeting the agreed resolution time**," which is a
*threshold-conformance* measure, structurally far closer to a percentile than to a mean. ✅ Table 2.2.

And the guide's own hedge, verbatim: ✅ *"There is no single best solution. Metrics will be based on
the overall service strategy and priorities of an organization."*

**Consequence for Chapter 6: the book's proposed MTTR → P85 upgrade is *more* ITIL-4-aligned than
MTTR is.** That is a document-backed claim, not a preference.

### 1.9 "Flow efficiency is typically 5–15%" ❌ — folklore

No published measurement located. The one vendor source cites 15% with **zero attribution**; the 40%
"mature team" figure footnotes a blog post that 404s. **LEI's Lean Lexicon does not define flow
efficiency at all.** Modig & Åhlström define it *qualitatively*, not as the touch-time ratio.

Note also the widely-repeated Modig & Åhlström "2 hours vs 1,008 hours" breast-cancer figures are
❌ **unverified from the book** — internally consistent (1,008 h = 42 days) but unchecked.

### 1.10a 🔴 "21.5 hours per week in meetings, over 70% unproductive" ❌ — **it is IN the manuscript**

**Found 2026-08-04 in `drafts/chapters/04`, line ~354.** Flagged in place with an `EDITORIAL_NOTE`.

> "The average knowledge worker spends **21.5 hours per week** in meetings, yet **surveys indicate** that
> **over 70%** of those meetings are deemed unproductive."

**Two hard figures resting on "surveys indicate," which names no survey.** Not verified — WebSearch quota
was exhausted when this was found, and **no source should be invented for it.** This is the same defect
pattern as §1.1–1.9: a plausible, widely-circulated statistic with no traceable primary.

⚠ **This one matters more than the other nine, because the other nine are hypothetical and this one is
actually printed.** A book that retires the 100:1 rule and the Standish figures while keeping an
unsourced meetings statistic has a credibility problem at exactly the point a skeptical reader checks.

✅ **RESOLVED 2026-08-04 — option 2 applied.** The numbers were removed and the argument kept; the
paragraph now invites the reader to compare their own calendar against their own sense of productive
time, which makes the same point and stakes nothing unverifiable. The manuscript now contains **zero
unsourced external *statistical* claims.** ⚠ If the quantitative version is ever wanted back, it needs a
named survey with a year — not "surveys indicate."

### 1.10b ⚠ "Research consistently shows" that multitasking hurts — ch04, KEEP but cite

**Found on the same sweep** (`drafts/04`, ~line 352). Three claims — lower productivity, higher error
rates, more stress — attributed to an unnamed literature. **This is the last unsourced appeal to
authority in the manuscript**, and it should be treated *differently* from §1.10a: it invents no
numbers, and the task-switching literature genuinely exists, so **softening it would weaken a probably-true
claim.** Cite it; do not vaguen it. Flagged in place.

🔎 **UNVERIFIED LEAD — do not print without opening it.** The usual primary is taken to be Rubinstein,
Meyer & Evans (2001), "Executive Control of Cognitive Processes in Task Switching," *JEP: Human
Perception and Performance*, alongside Monsell's task-switching reviews. **Neither was opened** (search
quota exhausted). Confirm author/year/journal and *what was actually measured* — and note the **stress**
claim likely comes from a different literature than the switching-cost claim, so all three outcomes need
separate support.

⚠ **Method note: this was the third too-narrow pattern in one session.** A scan for `research shows`
missed `research **consistently** shows`. The working sweep strips HTML comments first (otherwise the
editorial notes quoting removed text match themselves) and covers
`(research|studies|study|survey|data|evidence|statistics|experts|science) + (consistently|repeatedly|
clearly)? + (show|indicate|suggest|prove|agree|reveal|confirm)` plus `it is well-known` and
`widely documented/reported/accepted`. Two of its three hits are false positives — "Data reveals
behavior" (a rhetorical triad) and "What does the data say" (a question in a list) — so **read the hits,
do not just count them.**

**The options considered were:** (1) find and cite the primary survey — blocked, search quota exhausted,
and **no source was invented**; (2) keep the point, drop the numbers — chosen; (3) cut the paragraph.

🔑 **How it was missed, and the lesson for future scans.** An earlier pass this session reported **zero
numeric claims across the manuscript** — a false negative caused by the regex `[0-9]+\s*%\b`. **`\b`
after `%` never matches**, because `%` and a following `.` or space are both non-word characters, so
`"Cut by 50%."` was invisible. The corrected pattern found **16 percentage claims** (15 in ch04, 1 in
ch05). Fifteen are illustrative scenario figures inside fictional worked examples and need no source.
**Never trailing-`\b` after a non-word character**, and treat any "we found nothing" search result as a
hypothesis until the pattern is proven against a known positive.
[[feedback_truncated_search_reads_like_clean_one]]

### 1.10 Two Reinertsen principles are worded wrongly — and the book can say so precisely ✅

- **Q3, "capacity utilization increases queues exponentially."** The relationship is
  **hyperbolic** — ρ/(1−ρ), a pole at ρ = 1 — not exponential.
- **Q5, "variability increases queues linearly."** Linear in the **squared** coefficients of
  variation, therefore **quadratic in the CV** itself.

Computed U-factor, ρ/(1−ρ): 0.50→1.00 · 0.70→2.33 · 0.80→4.00 · **0.90→9.00** · 0.95→19.00 ·
0.99→99.00. Going from 90% to 95% utilization **doubles** expected queue time; 90% to 99%
**multiplies it by 11.**

---

## PART 2 — CORRECTIONS TO SPECIFIC MANUSCRIPT CLAIMS

### 2.1 "Quality is everyone's responsibility" — the introduction inverts Deming ✅ **RESOLVED 2026-08-04**

⚠ **Housekeeping note:** this section previously carried this heading but its body discussed only merit
rating, which did not actually evidence the inversion claim. The grounding was fetched 2026-08-04 and
is below. **The fix is now written into the introduction** as the book's opening hook.

**The grounding is Point 10, verbatim from the Deming Institute** — and it is devastating, because the
popular phrase is not merely absent from Deming, it is an instance of the thing Point 10 prohibits:

> "**Eliminate slogans, exhortations, and targets for the work force** asking for zero defects and new
> levels of productivity. Such exhortations only create adversarial relationships, as **the bulk of the
> causes of low quality and low productivity belong to the system and thus lie beyond the power of the
> work force**."

"Quality is everyone's responsibility" *is* a slogan, *is* an exhortation, and *is* aimed at the work
force. Deming did not neglect to say it; he told readers to stop saying things of this kind.

★ **The finding that makes this publishable rather than merely pedantic — the phrase is a corruption of
a real point, not an invention.** Point 14, verbatim:

> "Put everybody in the company to work to accomplish the transformation. **The transformation is
> everybody's job**."

So the popular version (a) keeps "everybody," (b) substitutes **quality** for **the transformation**,
and (c) re-aims a sentence addressed to *everybody in the company* — executives included — downward at
the front line. One noun swap and one change of audience converts a statement of management obligation
into a mild reproach to workers. **That is the whole mechanism of process-language decay in a single
example**, which is why it now opens the book.

**Also verified on the same page:** Point 3 — *"Cease dependence on inspection to achieve quality"* —
which is the primary citation for the book's recurring "quality is built, not inspected" theme, previously
asserted without one. And Point 8 — *"Drive out fear, so that everyone may work effectively for the
company"* — for the "fear kills improvement" theme.

⚠ **Rendering caution on Point 12b.** The deming.org 14 Points page renders 12b as only *"Remove
barriers that rob people in management and in engineering of their right to pride of workmanship."* The
fuller *Out of the Crisis* text continues *"…This means, inter alia, abolishment of the annual or merit
rating and of management by objective."* Both are correct; the web page truncates. Quote whichever you
cite, and do not blend them.

**Deadly Disease 3, verbatim, from the Deming Institute:** *"Evaluation of performance, merit rating,
or annual review."* ✅ And **Point 12b** requires "abolishment of the annual **or** merit rating and
of management by objective (see chapter 3)." ✅ *Out of the Crisis*, pp. 23–24.

Note the book's own framing is right: it is "the annual **or** merit rating," not "and," and not
"the annual merit rating." A widely-circulated university course PDF drops the "or" — do not cite it.

**Useful structural find:** Point 12b carries **Deming's own cross-reference "(see chapter 3)"** —
he explicitly ties the anti-merit-rating point of the 14 Points to the Deadly Diseases chapter.

### 2.2 Deadly Diseases — location and the five/seven confusion, resolved ✅

**Chapter 3 is titled "Diseases and Obstacles" and begins on p. 97** — verified from two independent
library TOC scans with byte-identical pagination. The enumerated list sits at pp. 97–98; the
*detailed discussion* of Disease 3 begins around p. 101 (🟡, two secondary sources).

**Five vs seven is a video-vs-book discrepancy, not an edition discrepancy.** ✅ The 1984 video covers
the first five; *Out of the Crisis* (1986) has seven, with 6 and 7 annotated *"Peculiar to industry in
the U.S., and beyond the scope of this book."* No authoritative source gives six.

### 2.3 ⚠ Page-citation discipline — the Kindle/print offset is **not constant** ✅

Measured across three quotations: offsets of **14, 10, and 11 pages**. And more than one Kindle
pagination is in circulation.

**Rule for the manuscript: never print a bare page number. Always name the edition AND format.**
"Kindle 2nd ed., p. 87" or "print, p. 101" — never "p. 87."

### 2.4 *Accelerate* on velocity says **two** drawbacks, not four ✅

Several secondary summaries claim "four characteristics." The book says **two**: focus on a **global
outcome**, and focus on **outcomes not output** (*Accelerate*, p. 14).

And the velocity critique is more precise than "Accelerate rejects story points." Verbatim, p. 12:
velocity "**is designed to be used as a capacity planning tool**" and fails only when repurposed for
productivity or comparison — because it is "relative and team-dependent," hence
"**incommensurable**"; because teams "**inevitably work to game their velocity**"; and because doing
so "**inhibits collaboration between teams**."

### 2.5 Little's Law — the "assumption-light" claim cites the wrong paper ✅

**The 1961 paper is assumption-HEAVY.** Its abstract requires the three means finite, the processes
**strictly stationary**, and the arrival process **metrically transitive**. ✅ Little, "A Proof for the
Queuing Formula: L = λW," *Operations Research* 9(3): 383–387, 1961.

The assumption-light version is the **2011** sample-path theorems. ✅ Little, "Little's Law as Viewed
on Its 50th Anniversary," *Operations Research* 59(3): 536–549, 2011 — where LL.2 drops the
empty-at-start-and-end condition, and Little states the law holds "**independent of queue
discipline**" and "even if there is no service operation."

**Little's own sentence, and the best epigraph available for a measurement chapter:** ✅

> "the determinism and exactness are **after the fact** … It just says that we are in the
> **measurement business, not the forecasting business**."

**The Kanban restatement is a different, heavier claim.** Substituting *throughput* (departures) for
λ (arrivals) adds five assumptions: arrivals = departures; everything that enters exits; WIP flat at
both ends; average age of WIP flat; consistent units. 🟡 (Vacanti, via two independent sources.)
Only "consistent units" is in Little's own theorems.

**Therefore: a WIP limit is not a way to apply Little's Law — it is a way to make Little's Law's
assumptions true.** Reinertsen's W2, "WIP constraints force rate-matching," is Vacanti's assumption 1
restated as a design intervention.

---

## PART 3 — THE PERCENTILE ARGUMENT, WITH THE ARITHMETIC

This closes editorial-backlog item 7 (P85 over averages) with computation rather than assertion.

### 3.1 Why the mean is not a typical value ✅ (computed)

For lognormal cycle times with median normalised to 1.0:

| σ | median | mean | mean − 1sd | P85 | **% of items faster than the mean** |
| --- | --- | --- | --- | --- | --- |
| 0.5 | 1.00 | 1.13 | +0.53 | 1.68 | 59.9% |
| 0.8 | 1.00 | 1.38 | +0.07 | 2.29 | 65.5% |
| 1.0 | 1.00 | 1.65 | **−0.51** | 2.82 | **69.1%** |
| 1.2 | 1.00 | 2.05 | **−1.63** | 3.47 | 72.6% |

**Two facts worth a box in the chapter.** At σ ≥ 1, **mean minus one standard deviation is negative**
— a nonsensical lower bound for a duration, so "mean ± σ" is not merely imprecise, it is outside the
domain. And at σ = 1.0, **69% of items finish faster than the mean**: the mean sits near the 69th
percentile, describing almost nobody.

*Corroborated in the author's own data: the Conduit portfolio mean cycle time of 7.04 days sits near
the 78th percentile. See `conduit-measured-evidence.md`.*

### 3.2 ⚠ But P85 needs far more data than practitioners assume ✅ (computed)

**The "n ≥ 19" rule is real and almost always misread.** log(0.05)/log(0.85) = 18.43, so n ≥ 19 —
but that gives only a 95% **one-sided bound against the sample maximum**, not a usable estimate.

Distribution-free two-sided 95% CI for the 85th percentile, as sample percentiles:

| n | 95% CI spans |
| --- | --- |
| 10 | 70th percentile → **unbounded above** |
| 20 | **65th percentile → the maximum** |
| 50 | 76th → 96th |
| 100 | 78th → 92nd |
| 500 | 82nd → 88th |

**At n = 20, a 95% interval for P85 runs from the 65th percentile of your sample to its largest
observation.** You need ~100 observations for [78th, 92nd].

Relative standard error of P85: **34% at n=20**, 22% at n=50, 15% at n=100, 7% at n=500. The
mechanism: quantile SE is inversely proportional to the **density** at that quantile, and tail density
is small — so **the higher the percentile, the more data it takes.** A team reporting P95 off two
sprints is reporting noise.

*This is the honest counterweight the chapter needs. "Use P85 not the average" is right; "you can
compute P85 from a sprint" is not.*

### 3.3 Google SRE says it plainly ✅

> "Most metrics are better thought of as distributions rather than averages."
> "A simple average can obscure these tail latencies."
> "we cannot assume that the mean and the median are the same—or even close to each other!"

✅ *Site Reliability Engineering*, O'Reilly 2016, ch. 4. **Note: cite 2016 (print), not the web
edition's 2017 metadata.**

Stronger still, from inside Google SRE: MTTR-type statistics are "**poorly suited for decision making
or trend analysis in the context of production incidents**." ✅ Štěpán Davidovič, *Incident Metrics in
SRE*, O'Reilly/Google.

And ✅ the VOID: **1,856 public incident reports from 610 organizations**, concluding
"**Duration and MTTR Are Shallow Data**" (Courtney Nash, SREcon22 Americas). The "shallow data"
coinage is **John Allspaw's**, not Nash's. ⚠ The word "**lognormal**" does not appear in the slides —
say "positively skewed / heavy-tailed" and attribute any lognormal fit to secondary reporting.

### 3.4 The nines table ✅ (computed, and cross-validated)

| SLO | per year | per 30-day month |
| --- | --- | --- |
| 99% | 3 d 15 h 36 m | 7 h 12 m |
| 99.9% | 8 h 45 m 36 s | 43 m 12 s |
| 99.99% | **52 m 33.6 s** | 4 m 19.2 s |
| 99.999% | 5 m 15.4 s | 25.9 s |

Cross-check: the SRE Book states 99.99% "permits approximately 52.56 minutes of downtime annually."
Independent computation gives **52.56 minutes**. ✅ Both agree.

---

## PART 4 — DORA, USED HONESTLY

### 4.1 The metrics were renamed repeatedly — quote the right year ✅

The fourth metric: MTTR (2014–15) → "time to restore service" (2016–2022, while the *diagrams* still
said MTTR — an inconsistency inside *Accelerate* itself, p. 14 prose vs p. 17 figure) →
**"failed deployment recovery time"** (2023 onward). In **2024 it moved from *stability* to
*throughput***. In 2025 the negative pole was renamed from *stability* to *instability*.

There are also **two different "fifth metrics"** — operational (availability 2018 → reliability 2021)
and delivery (**deployment rework rate**, 2024). Conflating them is a common error.

### 4.2 ⚠ The performance tiers are not stable across years — do not build an argument on them ✅

Change failure rate by tier, from the reports' own tables:

| Year | Elite | High | Medium | Low |
| --- | --- | --- | --- | --- |
| 2016 | — | 0–15% | **31–45%** | **16–30%** |
| 2018–19 | 0–15% | 0–15% | 0–15% | 46–60% |
| 2024 | 5% | **20%** | **10%** | 40% |

**In 2016 Medium was worse than Low. In 2018–19 the metric did no discriminating across three of four
tiers. In 2024 Medium (10%) is better than High (20%).** All printed in official tables.

And the Elite lead-time bar **loosened by an order of magnitude** — "less than one hour" (2018) →
"**less than one day**" (2019) — in the same year Elite's population share went 7% → 20%.

DORA admits it, verbatim: ✅ *"we don't consider any cluster to be elite this year"* (2022) and
*"Some are likely improved low performers, while others may be high performers who dropped"* (2019).
**In 2025 the tiers are gone entirely** — "elite" occurs zero times; seven team archetypes replace them.

DORA's own guidance: ✅ *"The best comparisons are those performed over time on the same applications
rather than between different applications."*

### 4.3 What DORA does and does not claim about causality ✅

*Accelerate* adopts a six-level taxonomy and states its analyses "**fall into the first three
categories**" — descriptive, exploratory, inferential predictive. Then, verbatim:

> "**PREDICTIVE, CAUSAL, AND MECHANISTIC ANALYSIS.** The final levels of analysis **were not included
> in our research, because we did not have the data necessary** … This type of analysis generally
> requires randomized studies."

Yet Part I uses "drive" and "impact" throughout. **Both halves are quotable from the same chapter.**

The 2024 report has a section titled "**Inferential leaps in results**": ✅ *"our survey is capturing a
moment in time, so temporal precedence is theoretical, not part of our data … we didn't do
longitudinal studies or a proper experiment."*

And the 2025 report **retreats from the word "effect"** in footnote 20: ✅ *"Last year, we spoke in
terms of 'effects'. This year, however, we will speak in terms of comparisons … we don't want to give
false assurances that we understand the underlying causal structure."*

Method is **snowball sampling** by DORA's own admission, with the bias stated: ✅ *"Our sample is
likely limited to organizations and teams that are familiar with DevOps."*

**Sample sizes:** ~45,000 cumulative across a decade, but any single finding rests on that year's N —
**2024: ~3,000 · 2025: exactly 4,867.** The big number is a credibility signal no single analysis uses.

### 4.4 DORA now measures rework — closing the hidden-factory loop with real data ✅

The 2024 survey instrument, verbatim: *"approximately how many deployments in the last six months
were not planned but were performed to address a user-facing bug in the application?"*

Result: *"our hypothesis that rework rate and change failure rate are related"* was confirmed, and the
two now form "a reliable factor of software delivery stability."

**So the book can run from Feigenbaum's 1994 estimate to a 2024 measured metric without conflating
anything.** Honest limits: survey-reported, respondent-estimated, six-month recall, one application,
counts *deployments* not effort.

### 4.5 ⚠ Change success rate is an official ITIL 4 metric that ITIL 4 never defines ✅

"**Change success/acceptance rate over period**" appears in Table 2.4 of the *Change enablement*
practice guide. But the guide **never defines "success"** — it offers only a prose gloss that output
success ≠ outcome success, leaving the denominator and the failure predicate to the implementer.

Worse, ITIL 4's own table puts "number and duration of change-related incidents" under a **different**
practice success factor — so the framework keeps "did it succeed" and "did it break something" in
separate buckets. **Two organisations can compute wildly different change success rates while both
conforming to ITIL 4.** That is a gift for a chapter about measurement definitions.

Also worth precision: ITIL 4 formally defines only **standard** and **emergency** changes. "Normal"
is defined in running prose. Tidy three-row tables presenting all three as equally formal are a small
fabrication that has propagated widely. And the rename went **change management → change control
(2019 Foundation §5.2.4) → change enablement (2020 practice guide)** — a three-step sequence most
sources compress to two.

---

## PART 5 — THE AI FINDING THE BOOK SHOULD BUILD ON

### 5.1 DORA measured AI adoption making delivery *less* stable ✅

Verbatim, 2024 report p. 40:

> "Contrary to our expectations, our findings indicate that AI adoption is negatively impacting
> software delivery performance. … an estimated **1.5% reduction** [in delivery throughput] for every
> 25% increase in AI adoption … The negative impact on delivery stability is larger (**an estimated
> 7.2% reduction** for every 25% increase in AI adoption)."

DORA's proposed mechanism, verbatim: *"the field [may have] forget[ten] one of DORA's most basic
principles—**the importance of small batch sizes**."*

**2025 partially reversed it:** throughput became positive, **but instability persisted**. Verbatim:
*"AI adoption now improves software delivery throughput … However, it still increases delivery
instability."* And the framing that titles the report: *"**AI's primary role … is that of an
amplifier. It magnifies the strengths of high-performing organizations and the dysfunctions of
struggling ones.**"*

⚠ **Three precision rules.** It is *per 25 percentage points of adoption*, never "AI reduced stability
by 7.2%." The 2024 report says "reduction in stability"; the 2025 report restates the same figure as
"increase in instability" — quote one and attribute it correctly. And **2025 publishes no percentages
at all** (standardized beta weights only), so any percentage attributed to 2025 is fabricated.

### 5.2 ★ The single most useful external finding for this book ✅ — **now verified from the primary**

**Upgraded 2026-08-04 from 🟡 to ✅.** The paper itself was opened and read; cite it directly, not via DORA.

**Full citation.** Joel Becker, Nate Rush, Beth Barnes, David Rein (Model Evaluation & Threat Research),
"Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity,"
arXiv:2507.09089v2 [cs.AI], 25 July 2025.

⚠ **The name is Beth Barnes, not Elizabeth Barnes.** Two of the four authors are marked equal
contribution (Becker, Rush); correspondence is Rush and Becker.

**The design, verbatim from the abstract:**

> "We conduct a randomized controlled trial (RCT) to understand how AI tools at the February–June
> 2025 frontier affect the productivity of experienced open-source developers. 16 developers with
> moderate AI experience complete 246 tasks in mature projects on which they have an average of 5
> years of prior experience. … Before starting tasks, developers forecast that allowing AI will reduce
> completion time by 24%. After completing the study, developers estimate that allowing AI reduced
> completion time by 20%. Surprisingly, we find that allowing AI actually **increases completion time
> by 19%**—AI tooling slowed developers down. This slowdown also contradicts predictions from experts
> in economics (39% shorter) and ML (38% shorter)."

**The four numbers in one line, which is how the book should print them:** forecast −24%, post-hoc
estimate −20%, economists −39%, ML experts −38%, **actual +19%**.

**Precision facts the secondary sources drop:**
- **136** AI-allowed issues, **110** AI-disallowed. Tasks averaged **2.0 hours**.
- Repositories averaged **23,000 stars**, **~10 years old**, **>1,100,000 lines of code**.
- Developers averaged **5 years and 1,500 commits** on the repos they worked in.
- Tools were **Cursor Pro with Claude 3.5/3.7 Sonnet** — state of the art *at that time*.
- Expert forecasts came from **34 economics experts and 54 ML experts** (not a vague "experts say").
- **21** properties of the setting were evaluated as candidate explanations — *not* 20.

★ **The finding inside the finding, which is better than the headline.** Developer time forecasts
correlated with actual time at **r = 0.64** (AI-allowed) and **r = 0.59** (AI-disallowed). Verbatim:

> "developers are broadly well-calibrated on the relative amount of time that issues will take, but
> their expectations regarding the usefulness of AI assistance are **reversed**."

This is the sharpest version of the argument for this book. These developers were *not* bad estimators.
Their estimation was sound and their judgment of their own tooling was inverted. A blanket "developers
can't estimate" reading of this paper gets it backwards.

**The five factors METR judges likely contributors** (their Table 1, with their own evidence):

| Factor | What they measured |
| --- | --- |
| Over-optimism about AI usefulness | The −24% / −20% forecast gap itself; may cause developers to *overuse* AI |
| High developer familiarity with repositories | Developers **slowed down more on issues they knew better** |
| Large and complex repositories | ~10 years old, >1.1M LOC |
| Low AI reliability | Developers accepted **<44%** of AI generations; **9% of total time** spent reviewing/cleaning AI output; majority reported making major changes to clean up AI code |
| Implicit repository context | AI did not use tacit knowledge developers held |

They also record **4% of time waiting on AI generations**, and — from screen recordings — that with AI
allowed, developers spent *less* time coding and reading, more time prompting, reviewing and waiting,
and **more time idle**.

🔴 **Three ways to get this citation wrong, all of which the book must avoid.**

**1. Do not invent a confidence interval.** The paper reports 95% CIs using HC3 standard errors, but
the interval on the headline effect is rendered **graphically in Figure 1** and does not appear as a
number in the text. Cite the point estimate and the robustness discussion. (A machine extraction of
this same PDF confidently returned "a slowdown of 3–11%" — that figure is **not in the paper**. Noted
here because fabricating a plausible interval is exactly the failure this chapter is about.)

**2. The raw difference is 34%, not 19%.** Their footnote 12: the unadjusted ratio of implementation
times is **34%**, and the regression-adjusted estimate is **19%**, because AI-allowed issues came out
slightly harder after randomization. **19% is the defensible number.** Anyone quoting 34% is quoting
an estimator the authors explicitly set aside.

**3. METR disclaims the generalization most people draw.** Their Table 2 lists claims they do *not*
provide evidence for. First row, verbatim:

> "We do not provide evidence that: **AI systems do not currently speed up many or most software
> developers** … We do not claim that our developers or repositories represent a majority or
> plurality of software development work."

They further state they estimate **some developers did experience speedup** (their Figure 17), that
they studied only software development, that better elicitation or repository-specific finetuning
could plausibly yield positive speedup, and that near-future systems may speed up developers in this
exact setting.

⚠ **And the book must apply its own standard here: n = 16 developers.** A manuscript that warns P85
needs ~100 observations (§3.2) cannot lean on a 16-person study uncritically. The honest framing is
the one METR uses: a well-instrumented result in a specific setting that contradicted every forecast
made about it, including by the people in it. **That is enough. It does not need to be more.**

**Why this matters more than anything else here:** it is the same defect the author measured on his
own team. His `/insights` analysis found **premature confidence in 8 of 9 engineers**, including
himself declaring a deployment complete from a green pipeline — and concluded *"the team's quality
control currently depends on individual skepticism, and skepticism is unevenly distributed."*

**METR measured the gap between felt and actual productivity in a controlled trial. The author
measured the same gap in his own team and named it.** One is external and instrumented with screen
recordings; the other is first-hand, dated, and includes the author among the offenders. Neither needs
embellishment, and together they make the argument the current Chapter 11 only gestures at.

**Why this matters more than anything else here:** it is the same defect the author measured on his
own team. His `/insights` analysis found **premature confidence in 8 of 9 engineers**, including
himself declaring a deployment complete from a green pipeline — and concluded *"the team's quality
control currently depends on individual skepticism, and skepticism is unevenly distributed."*

**METR measured the gap between felt and actual productivity. The author measured the same gap in his
own team and named it. Those two facts, side by side, are the AI chapter.** One is external, peer-cited
evidence; the other is first-hand, dated, and includes the author among the offenders. Neither needs
embellishment, and together they make the argument the current Chapter 11 only gestures at.

---

## PART 6 — SOLID CITATIONS FOR THINGS THE BOOK ALREADY ASSERTS

✅ **Takt time** — LEI Lean Lexicon: *"a calculation of the available production time divided by
customer demand"*; 480 minutes ÷ 240 widgets = 2 minutes. First used in the German aircraft industry
in the 1930s; *Takt* is German for a precise interval such as a musical meter.

⚠ **Terminological landmine worth a box:** LEI's "cycle time" (*"the time required to produce a part
or complete a process"*) is **not** the Kanban Guide's "cycle time" (*"elapsed time between when a
work item started and when a work item finished"*). Different quantities, same name. The Kanban one
feeds P85 service levels.

✅ **Service Level Expectation** — *The Kanban Guide* v2025.5: *"a period of elapsed time and a
probability associated with that period (e.g., '85% of work items will be finished in eight days or
less')."* A clean citation for what P85 means **as a commitment**.

✅ **Value stream, muda** — LEI Lexicon, verbatim definitions available. ⚠ Note LEI's muda page does
**not** enumerate the seven wastes or attribute them to Ohno.

✅ **Error budget** — *The Site Reliability Workbook*: *"the error budget is 100% minus the SLO."*
Worked example verified arithmetically.

✅ **Availability targets should not be maximised** — SRE Book ch. 3: a service should be "reliable
enough, but no more reliable than it needs to be," because "a user on a 99% reliable smartphone cannot
tell the difference."

---

## PART 7 — PSYCHOLOGICAL SAFETY, FOR CHAPTER 3 ✅

**Added 2026-08-04.** Chapter 3 ("Building a Speak-Up Culture") previously had **zero citations** while
resting entirely on this construct. The founding paper was opened and read in full.

### 7.1 The citation, exactly ✅

Amy Edmondson, "Psychological Safety and Learning Behavior in Work Teams," *Administrative Science
Quarterly*, Vol. 44, No. 2 (June 1999), pp. 350–383. JSTOR stable URL: `jstor.org/stable/2666999`.
Author affiliation on the paper is **Harvard University**.

⚠ Note the byline: the 1999 paper is bylined **Amy Edmondson**; her later work is **Amy C. Edmondson**.
Match the byline to the work you are citing.

### 7.2 The definition — use this wording, not a paraphrase ✅

Verbatim, p. 354:

> "Team psychological safety is defined as **a shared belief that the team is safe for interpersonal
> risk taking**. For the most part, this belief tends to be **tacit**—taken for granted and not given
> direct attention either by individuals or by the team as a whole."

The abstract's phrasing — *"a shared belief held by members of a team that the team is safe for
interpersonal risk taking"* — is the version most often quoted, and both are accurate.

★ **"Tacit" is load-bearing and almost always dropped.** Edmondson's construct is a belief teams hold
*without discussing it*. That has a direct operational consequence for the book: you cannot establish
psychological safety by announcing it. A team's real answer is already installed, and it was installed
by what happened the last time someone spoke up.

### 7.3 🔴 The passage that corrects the most common misreading ✅

This is the highest-value quote in the paper for this manuscript. Verbatim, p. 354:

> "Team psychological safety **is not the same as group cohesiveness**, as research has shown that
> cohesiveness can **reduce** willingness to disagree and challenge others' views, such as in the
> phenomenon of groupthink (Janis, 1982), implying a lack of interpersonal risk taking. The term is
> meant to suggest **neither a careless sense of permissiveness, nor an unrelentingly positive affect**
> but, rather, a sense of confidence that the team will not embarrass, reject, or punish someone for
> speaking up."

**Why this matters for Chapter 3.** The popular management reading of psychological safety is
"niceness" or "team harmony." Edmondson explicitly rules both out **in the paper that introduced the
term** — and goes further, noting cohesiveness can *work against* the thing she is measuring. A
chapter arguing for speak-up culture that cites this passage is arguing from the source; one that
equates safety with comfort is contradicted by it.

### 7.4 Psychological safety vs. trust — a real distinction, not a synonym ✅

Verbatim, p. 354:

> "Trust is defined as the expectation that others' future actions will be favorable to one's
> interests, such that one is willing to be vulnerable to those actions (Mayer, Davis, and Schoorman,
> 1995; Robinson, 1996). Team psychological safety **involves but goes beyond interpersonal trust**;
> it describes a **team climate** characterized by interpersonal trust and mutual respect in which
> people are comfortable being themselves."

The operative difference for the book: **trust is dyadic and forward-looking; psychological safety is
a group-level climate.** Edmondson argues explicitly that for it to be a group-level construct it must
characterize the team rather than individual members, and members must hold similar perceptions of it.

### 7.5 The study and what it actually found ✅

- **51 work teams** at a company pseudonymed **"Office Design Incorporated" (ODI)** — a manufacturer
  of **office furniture**, ~**5,000 employees**, teams in place since **1979**. Multimethod:
  quantitative surveys plus qualitative interviews and observed team meetings.
- Analysis at the **group level (N = 51)**, because members of the same team are not independent.
- **Team performance was rated by customers**, not self-reported — a real strength worth mentioning.

**The findings, precisely:**
1. Team psychological safety **is** associated with learning behavior.
2. Team **efficacy is not**, once psychological safety is controlled for.
3. **Learning behavior mediates** between psychological safety and team performance.

★ **Point 3 is the one the book should build on.** Psychological safety does not improve performance
directly in Edmondson's model — it works **through learning behavior**. Safety without any change in
how the team gets and processes information predicts nothing. That is a far more useful and more
defensible claim than "safe teams perform better," and it maps directly onto the book's own argument
that speaking up only matters if the system does something with what was said.

**Sample scale items** (a mix of positively and negatively worded items, to mitigate response-set bias):
*"If you make a mistake on this team, it is often held against you"* (reverse scored); *"It is safe to
take a risk on this team"*; *"No one on this team would deliberately act in a way that would undermine
my efforts."* Learning-behavior items include *"We regularly take time to figure out ways to improve
our team's work process."*

⚠ **The sampling caveat, in Edmondson's own words** (p. 358) — the book should not overstate this study:

> "this sample was **not selected to ensure representativeness** of the population of all teams at
> ODI, nor were the four subgroups of team types selected to ensure that they were representative of
> each type."

Participation was voluntary. One company, one industry, 1999, n = 51 teams. It is the founding
construct paper and it is well-instrumented; it is **not** a general law of organizations, and this
book's measurement discipline is better served by saying so.

### 7.6 The error-reporting finding — a verified pointer, not yet a verified quote 🟡

The famous counterintuitive result — that better-performing units **reported more** errors, because
detection depends on climate rather than error rate — is **Edmondson's 1996 paper, not the 1999 one.**
Full reference, transcribed verbatim from the 1999 paper's own reference list:

Edmondson, Amy C. 1996. "Learning from mistakes is easier said than done: Group and organizational
influences on the detection and correction of human error." *Journal of Applied Behavioral Science*,
32: 5–32.

🟡 **The citation is confirmed; the finding's exact wording and figures are not** — that paper was not
opened. **Do not print a quote or a number from it** until it is. If the book wants the
error-reporting argument (and it should — it is the strongest possible opening for Chapter 3), that
paper is the next thing to read.

⚠ **Project Aristotle** remains unverified and is deliberately *not* written up here. Google's
internal study is a blog-published, non-peer-reviewed corporate analysis; it is the reason the term
went mainstream, but it is not citation-grade evidence and should be introduced as "Google reported"
rather than "research shows." Retrieving it was blocked — `rework.withgoogle.com` has been retired.

★ **What Chapter 3 already has that is stronger than any of this:** an engineer filed two defects
**against the author's own tool**, and the author wrote them up against himself. That is a first-hand,
dated instance of exactly what Edmondson's scale items are trying to detect — and no survey instrument
in the literature is as persuasive to a reader as the author documenting a defect in his own work.

---

## PART 8 — THE LEAN AND TOC CANON THE BOOK ASSERTS THROUGHOUT 🟡

**Added 2026-08-04.** These are asserted repeatedly in the manuscript and were previously unverified.
All are now sourced — but **all are 🟡, from authoritative secondary sources, not from the primary books.**
Read §8.4 before printing any of it.

### 8.1 Womack & Jones's five principles ✅ (date) / 🟡 (wording)

**The 1996 date is confirmed.** The Lean Enterprise Institute — Womack's own institute — attributes the
five principles to **"Womack and Jones 1996, p. 10."** That resolves the open question in the prior
draft, where the earliest record found was 1998.

LEI's rendering, verbatim:

1. "Specify value from the standpoint of the end customer by product family."
2. "Identify all the steps in the value stream for each product family, eliminating whenever possible
   those steps that do not create value."
3. "Make the value-creating steps occur in tight sequence so the product will flow smoothly toward the
   customer."
4. "As flow is introduced, let customers pull value from the next upstream activity."
5. "As value is specified, value streams are identified, wasted steps are removed, and flow and pull
   are introduced, repeat this process again and continue it until a state of perfection is reached in
   which perfect value is created with no waste."

⚠ **LEI's own words are "Adapted from Womack and Jones 1996, p. 10."** *Adapted* — so this is **not** a
verbatim quotation of Womack and Jones. Cite it as LEI's formulation of their principles, or open the
book. Do not print it inside quotation marks attributed directly to Womack and Jones.

### 8.2 Ohno's seven wastes 🟡

LEI's enumeration, verbatim, attributed on that page to **Ohno's categorization** — with **no book,
year, or page given**:

| Waste | LEI's definition, verbatim |
| --- | --- |
| Overproduction | "Producing ahead of what's actually needed by the next process or customer." |
| Waiting | "Operators standing idle as machines cycle, equipment fails, needed parts fail to arrive, etc." |
| Conveyance | "Moving parts and products unnecessarily, such as from a processing step to a warehouse to a subsequent processing step." |
| Processing | "Performing unnecessary or incorrect processing, typically from poor tool or product design." |
| Inventory | "Having more than the minimum stocks necessary for a precisely controlled pull system." |
| Motion | "Operators making movements that are straining or unnecessary, such as looking for parts, tools, documents, etc." |
| Correction | "Inspection, rework, and scrap." |

⚠ **Two naming cautions.** LEI's list uses **Conveyance / Processing / Correction**, where most
secondary sources say **Transport / Over-processing / Defects**. The concepts match; the labels do not.
And note this is *still* not Ohno — the primary is *Toyota Production System: Beyond Large-Scale
Production* (1988), which was **not opened**. Also recorded previously: LEI's separate *muda* page does
**not** enumerate the seven wastes or attribute them to Ohno, so the two LEI pages are inconsistent
with each other about attribution.

### 8.3 🔴 Goldratt's five focusing steps — the wording problem is worse than recorded 🟡

The prior note flagged a variant in **step 2**. Verification found the variance extends to **step 5**.

The Theory of Constraints Institute renders them:

1. "IDENTIFY the system's constraint"
2. "**EXPLOIT** the constraint"
3. "SUBORDINATE everything else to the constraint"
4. "ELEVATE the constraint"
5. "**PREVENT INERTIA** from becoming the constraint"

**Two substantive divergences from the commonly printed form:**

- **Step 2.** The fuller wording is "**Decide how to** exploit the constraint." The abbreviated
  "EXPLOIT" loses the point that step 2 is a **decision** — which is precisely what step 3 then
  subordinates everything to. Subordinating everything to a *decision* is a coherent instruction;
  subordinating everything to a verb is not. **If the book uses these steps as an argument, it needs
  the fuller form.**
- **Step 5.** Commonly printed as "*If a constraint has been broken, go back to step 1*" — a **loop**.
  TOC Institute instead renders it as "prevent inertia from becoming the constraint" — a **warning**.
  These are different instructions. Goldratt's own formulations across editions contain both ideas
  (the loop, and the inertia warning), which is likely why sources diverge.

⚠ **No page citation was obtained, and no primary text was opened.** *The Goal* is a novel and is not
where the five steps are cleanly enumerated; the usual primary is ***The Goal*** (2nd rev. ed.) or
***It's Not Luck*** / ***Theory of Constraints*** (1990). **Do not print a page number for these steps
until one of those is in hand.**

### 8.4 ⚠ The standard this book has set for itself

Part 1 of this document retires nine claims largely because they were **repeated from secondary sources
without anyone opening the primary**. Everything in Part 8 is currently in that same category — better
sourced than folklore, but not primary. Two honest options:

1. **Attribute to the intermediary**: "the Lean Enterprise Institute defines the seven wastes as…"
   That is accurate, verifiable today, and requires no further work.
2. **Open the three books** — *Toyota Production System* (1988), *Lean Thinking* (1996) p. 10, and a
   Goldratt primary — and upgrade to ✅ with page numbers.

**What the book must not do is print these as verbatim quotations of Ohno, Womack, or Goldratt on the
strength of what is written above.** Option 1 costs nothing and is defensible. Silent upgrading from
🟡 to unmarked is the exact failure Part 1 documents.

---

## INCOMPLETE — research cut short, and the highest-value gaps

These passes were terminated by session limits. **Nothing here should be treated as a null result.**

**✅ CLOSED 2026-08-04 — two of the largest gaps are now primary-sourced.** The METR RCT was read in
full (see §5.2, upgraded 🟡→✅) and Edmondson 1999 was read in full (see the new PART 7). What remains:

| Gap | Why it matters |
| --- | --- |
| **Edmondson 1996** (*JABS* 32: 5–32) — the error-reporting finding | Reference verified, **content not**. The best available opening for Chapter 3. §7.6 has the exact citation to chase. |
| **Further AI-productivity studies beyond METR** — deskilling, over-reliance, long-run skill effects | METR now anchors chs 10–12, but it is **one RCT with n = 16**. The chapter is one study deep. METR's own Table 3 names comparison studies (Paradis et al.; Yeverechyahu et al.) — that table is the reading list. |
| **IEC 60050 / Electropedia Part 192** (MTBF, MTTF, mean repair time, availability) | Free and authoritative; blocked by 403. The correct primary citation for reliability terms. |
| **A primary Six Sigma text for FPY / RTY** | ASQ blocked. Currently only a vendor website can be cited — not citation-grade. |
| ~~Ohno's seven wastes; Womack & Jones's five principles; Goldratt's five steps~~ | **Partially closed 2026-08-04 → see PART 8.** All three are now sourced from authoritative secondaries and the *Lean Thinking* **1996** date is confirmed. Still needs: the three **primary books** for page-level citation, and Part 8 explains why that matters. |
| **Juran "gold in the mine"; Crosby's 15–20% with a page** | Crosby's only verified primary utterance is a hedged 1995 interview: *"Something like 20% to 25% of revenues."* Estimates, not measurements — worth saying. |
| **Peer-reviewed critique of the DORA instrument** | None found, but this is a bounded-search null. **Do not write "there is no peer-reviewed critique" as fact.** |

**One 20-minute action would settle more than any further web research:** a physical or borrowed copy
of *Out of the Crisis*, pp. 97–102. That alone resolves the "of/from" and "friendly/unfriendly"
variants in Disease 2, the "It/The merit rating" subject question, and the exact print page for the
merit-rating passage — all of which currently rest on secondary citations.
