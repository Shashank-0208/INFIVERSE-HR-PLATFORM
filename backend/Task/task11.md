## Page 1

# TASK TITLE
Shashank Mishra — BHIV HR Platform — Internal Test Readiness & Truth Lock Sprint

---

## READ THIS FIRST (MANDATORY)

This task is about making BHIV HR a truthful, internally testable, non-failing platform by 29th Jan.
You are NOT adding new features.
You ARE fixing reality gaps, removing silent mocks, and locking one honest, working hiring loop.
Anything that looks like it works but does not mutate real state must be exposed or fixed.
Outcome: By 29th Jan, the system must withstand internal testing without explanations.

---

## INTEGRATION BLOCK

Ishan Shirole — Automation Engine — receives real status-change triggers
Nikhil — Frontend — must see real state updates without refresh hacks
Vinayak — Internal Testing — executes test cases and reports failures
You — Backend / Platform Lead — single source of backend truth

---

## TIMELINE

Start: 24 Jan
End: 28 Jan (hard stop)
Sunday: 1 day reduced velocity, not a buffer
Daily reporting required (WhatsApp + brief commit note)

---


## Page 2

# DAY-BY-DAY BREAKDOWN

## DAY 1 — REALITY AUDIT & TRUTH LOCK (24 Jan)
Focus: Identify what is real vs what is pretending.

### Tasks:
1. Produce TRUTH_MATRIX.md
   For each major flow, mark one: REAL / PARTIAL / MOCK
   Mandatory rows:
   * Job creation
   * Candidate application
   * Candidate profile persistence
   * Recruiter shortlist / reject
   * Automation trigger
   * Notifications
   * Frontend state sync
2. Kill silent success paths
   Any API returning success without DB mutation must:
   * Either be fixed
   * Or explicitly return “NOT IMPLEMENTED”
3. Lock canonical collections
   Confirm and document which MongoDB collections are source of truth for:
   * jobs
   * candidates
   * applications
   * feedback
   * status history

### Output Day 1:
* TRUTH_MATRIX.md
* List of disabled or exposed mock endpoints
* Commit with message: “Truth lock — no silent mocks”

---


## Page 3

# DAY 2

a.
— END-TO-END HIRING LOOP HARDENING (25–26 Jan)
Focus: One undeniable hiring loop that survives restarts.

Tasks:
1. Job → Application → Candidate loop

Verify and fix so that:
* Job is created and queryable
* Candidate applies via frontend or API
* Application record is created
* Candidate profile reflects APPLIED status
2. Recruiter action correctness
Ensure shortlist / reject:
* Mutates DB state
* Is visible via GET APIs
* Reflects immediately on frontend
3. Status-change contract
Standardize and document the status-change payload sent to Ishan.
No ad-hoc fields. One contract.

Output Day 2:
* REAL_HIRING_LOOP.md (step-by-step with endpoints)
* Short screen recording of full loop
* DB snapshot evidence (before/after)

b.
— AUTOMATION & FRONTEND SYNC VERIFICATION (27 Jan)
Focus: What happens after shortlist must be visible.

Tasks:

---


## Page 4

1. Verify automation call
On shortlist:
* Confirm Ishan's endpoint is hit
* Confirm log or external action occurs
2. Frontend truth sync
Validate that frontend shows:
* Updated candidate status
* No fake toasts
* No stale data after refresh
3. Failure clarity
If automation or notification fails:
* Error must surface
* No silent fallback

Output Day 3:
* Logs proving automation trigger
* FRONTEND_BACKEND_SYNC.md
* Known failure cases documented

---

DAY 3 — INTERNAL TEST READINESS & FREEZE (28-29 Jan)
Focus: Make it testable without you present.

Tasks:
1. INTERNAL_TEST_CHECKLIST.md
Clear checklist for Vinayak to run:
* What to click
* Expected result
* What counts as failure
2. DEMO_FLOW.md (updated)
Exact demo steps, no improvisation.
3. Hard freeze
* No new code after checklist pass
* Only bug fixes allowed

---


## Page 5

## Final Output:
* Internal test passes without explanation
* One stable repo state
* Confirmation message:
“BHIV HR is internally testable end-to-end with known limitations.”

---

## DELIVERABLES (MANDATORY)

1. TRUTH_MATRIX.md
2. REAL_HIRING_LOOP.md
3. FRONTEND_BACKEND_SYNC.md
4. INTERNAL_TEST_CHECKLIST.md
5. Updated DEMO_FLOW.md
6. Evidence (screenshots / short videos)
7. One clean, tagged commit for test handover

---

## LEARNING KIT

### Search keywords:
* “FastAPI state mutation patterns”
* “MongoDB workflow integrity”
* “Frontend backend contract testing”

### Reading:
* REST state transition best practices
* MongoDB transactional guarantees

### LLM prompts:
* “How do I detect silent success paths in APIs?”
* “Design a truth matrix for backend systems.”

---


## Page 6

# PROFESSIONAL CLOSING NOTE

This sprint is about credibility, not scope.
If something is not ready, expose it.
A smaller honest system beats a larger lying one.
Get it stable, get it testable, then freeze.TASK TITLE
Shashank Mishra — BHIV HR Platform — Internal Test Readiness & Truth Lock Sprint

---

## READ THIS FIRST (MANDATORY)

This task is about making BHIV HR a truthful, internally testable, non-failing platform by 29th Jan.
You are NOT adding new features.
You ARE fixing reality gaps, removing silent mocks, and locking one honest, working hiring loop.
Anything that looks like it works but does not mutate real state must be exposed or fixed.
Outcome: By 29th Jan, the system must withstand internal testing without explanations.

---

## INTEGRATION BLOCK

Ishan Shirode — Automation Engine — receives real status-change triggers
Nikhil — Frontend — must see real state updates without refresh hacks
Vinayak — Internal Testing — executes test cases and reports failures
You — Backend / Platform Lead — single source of backend truth

---

## TIMELINE

Start: 24 Jan

---


## Page 7

End: 29 Jan (hard stop)
Sunday: 1 day reduced velocity, not a buffer
Daily reporting required (WhatsApp + brief commit note)

---

## DAY-BY-DAY BREAKDOWN

---

### DAY 1 — REALITY AUDIT & TRUTH LOCK (24 Jan)
Focus: Identify what is real vs what is pretending.

Tasks:
1. Produce TRUTH_MATRIX.md
   For each major flow, mark one: REAL / PARTIAL / MOCK
   Mandatory rows:
   * Job creation
   * Candidate application
   * Candidate profile persistence
   * Recruiter shortlist / reject
   * Automation trigger
   * Notifications
   * Frontend state sync
2. Kill silent success paths
   Any API returning success without DB mutation must:
   * Either be fixed
   * Or explicitly return “NOT IMPLEMENTED”
3. Lock canonical collections
   Confirm and document which MongoDB collections are source of truth for:
   * jobs
   * candidates
   * applications
   * feedback
   * status history

Output Day 1:

---


## Page 8

*   TRUTH_MATRIX.md
*   List of disabled or exposed mock endpoints
*   Commit with message: "Truth lock — no silent mocks"

---

**DAY 2 — END-TO-END HIRING LOOP HARDENING (25-26 Jan)**

**Focus:** One undeniable hiring loop that survives restarts.

**Tasks:**
1.  Job → Application → Candidate loop

**Verify and fix so that:**
*   Job is created and queryable
*   Candidate applies via frontend or API
*   Application record is created
*   Candidate profile reflects APPLIED status
2.  Recruiter action correctness

**Ensure shortlist / reject:**
*   Mutates DB state
*   Is visible via GET APIs
*   Reflects immediately on frontend
3.  Status-change contract

**Standardize and document the status-change payload sent to Ishan.**
No ad-hoc fields. One contract.

**Output Day 2:**
*   REAL_HIRING_LOOP.md (step-by-step with endpoints)
*   Short screen recording of full loop
*   DB snapshot evidence (before/after)

---

**DAY 3 — AUTOMATION & FRONTEND SYNC VERIFICATION (27 Jan)**

---


## Page 9

Focus: What happens after shortlist must be visible.

Tasks:
1. Verify automation call

On shortlist:
* Confirm Ishan's endpoint is hit
* Confirm log or external action occurs
2. Frontend truth sync
Validate that frontend shows:
* Updated candidate status
* No fake toasts
* No stale data after refresh
3. Failure clarity
If automation or notification fails:
* Error must surface
* No silent fallback

Output Day 3:
* Logs proving automation trigger
* FRONTEND_BACKEND_SYNC.md
* Known failure cases documented

---

DAY 4 — INTERNAL TEST READINESS & FREEZE (28-29 Jan)
Focus: Make it testable without you present.

Tasks:
1. INTERNAL_TEST_CHECKLIST.md
Clear checklist for Vinayak to run:
* What to click
* Expected result
* What counts as failure
2. DEMO_FLOW.md (updated)
Exact demo steps, no improvisation.

---


## Page 10

3. Hard freeze
* No new code after checklist pass
* Only bug fixes allowed

Final Output:
* Internal test passes without explanation
* One stable repo state
* Confirmation message:
“BHIV HR is internally testable end-to-end with known limitations.”

---

DELIVERABLES (MANDATORY)

1. TRUTH_MATRIX.md
2. REAL_HIRING_LOOP.md
3. FRONTEND_BACKEND_SYNC.md
4. INTERNAL_TEST_CHECKLIST.md
5. Updated DEMO_FLOW.md
6. Evidence (screenshots / short videos)
7. One clean, tagged commit for test handover

---

LEARNING KIT

Search keywords:
* “FastAPI state mutation patterns”
* “MongoDB workflow integrity”
* “Frontend backend contract testing”

Reading:
* REST state transition best practices
* MongoDB transactional guarantees

LLM prompts:
* “How do I detect silent success paths in APIs?”

---


## Page 11

- “Design a truth matrix for backend systems.”