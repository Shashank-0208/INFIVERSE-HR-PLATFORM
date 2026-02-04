## Page 1

# TASK TITLE
Shashank Mishra — BHIV HR Platform — Reusable Hiring Loop Extraction (Framework Hardening Sprint)

---

## READ THIS FIRST (MANDATORY)
This task converts the now-working hiring loop into a reusable, product-agnostic backend module.
You are responsible for extracting, formalizing, and documenting the hiring flow so it can be reused across ERP, CRM, Artha, Nyaya, Setu, and future products without rewriting logic.
You are NOT building new features or expanding scope.
You must NOT rename or expose Sovereign Core, InsightFlow, KSML, or governance concepts.
The outcome must be a clean, reusable backend unit that still runs the existing HR demo without regressions.

---

## INTEGRATION BLOCK
Ishan Shirode — Automation & Triggers — consumes status-change events you emit
Nikhil — Frontend UI — must see no breaking changes in APIs
Vinayak — Testing & Verification — validates reuse readiness and demo stability
You — Backend & Platform — owner of extraction, boundaries, and contracts

---

## TIMELINE
Duration: 3 days (hard stop)
Start: Immediately after current demo loop is confirmed DONE
End: Day 3 EOD
No buffer. No partial handover.

---


## Page 2

# DAY-BY-DAY BREAKDOWN

## DAY 1 — IDENTIFY & FREEZE THE HIRING LOOP
Focus: Make the hiring loop explicit and bounded.

Tasks:
1. Identify the exact flow that currently works end-to-end:
   job creation → candidate apply → application → shortlist
2. Freeze this as the canonical loop (no logic changes).
3. Clearly separate code into:
   a) Hiring loop logic
   b) HR-specific adapters (naming, fields, UI expectations)
4. Create documentation:
   docs/framework/HIRING_LOOP_OVERVIEW.md
   Contents:
   * Inputs
   * State transitions
   * DB mutations
   * Events emitted

Output Day 1:
* No broken demo
* Hiring loop clearly identified
* One markdown file describing the loop in plain language

---

## DAY 2 — EXTRACT REUSABLE CORE
Focus: Make the loop portable without rewriting.

Tasks:

---


## Page 3

1. Extract hiring loop into a reusable module or directory, for example:
   /core/hiring_loop/
2. Ensure the loop:
   * Does not reference “HR” in its logic
   * Accepts generic entities (job, candidate, application, status)
3. Introduce a thin adapter layer for HR-specific usage (keep existing behavior intact).
4. Verify that:
   * HR demo still works exactly as before
   * No endpoint contracts are broken

Documentation:
docs/framework/BOUNDARY_DEFINITION.md
* What is reusable
* What is HR-specific
* What is explicitly NOT reusable

Output Day 2:
* Extracted reusable module
* HR still functional
* Boundary documentation complete

---

**DAY 3 — REUSE PROOF + HANDOVER**
Focus: Prove this is not HR-only.

Tasks:
1. Create a mock second use-case (no UI):
   * Example: “Generic Application Intake” or “Non-HR Task Intake”
   * Reuse the same hiring loop with different labels
2. Show that:
   * State transitions still work

---


## Page 4

*   Events still emit

3.  Write final handover docs:
    *   docs/framework/REUSABILITY_GUIDE.md
    *   docs/framework/FRAMEWORK_HANDOVER.md
4.  Update Known Limitations clearly:
    *   Single-tenant
    *   No external job boards
    *   Notifications may be mocked

Output Day 3:
*   One reusable backend loop
*   HR demo still stable
*   Clear proof of reuse
*   Clean handover documentation

---

## LEARNING KIT (MANDATORY)

Video keywords:
*   “Clean architecture backend use case extraction”
*   “Hexagonal architecture FastAPI”
*   “Reusable domain logic backend”

Reading:
*   Clean Architecture (Uncle Bob) — Use Case layer
*   FastAPI dependency injection patterns
*   Domain vs Adapter separation

LLM Learning Prompts:
*   “How to extract a domain use-case from an existing backend without breaking APIs.”
*   “How to design reusable state-transition logic for multiple products.”
*   “What makes backend logic portable across domains.”

---


## Page 5

# DELIVERABLES

1.  Updated backend repo (same repository)
2.  New docs folder:
    /docs/framework/
    *   HIRING_LOOP_OVERVIEW.md
    *   BOUNDARY_DEFINITION.md
    *   REUSABILITY_GUIDE.md
    *   FRAMEWORK_HANDOVER.md
3.  Confirmation that HR demo still runs without regression
4.  Short note stating:
    "The hiring loop is now reusable beyond HR."

