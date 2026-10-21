<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Edwin Meléndez Palomino
- GITHUB_USER: emelendez20201-ship-it
- TEAM: Futbolix
- SPRINT_GOAL: Make the reservation journey observable: trace map, structured log contract, instrumentation code and metric catalog (delivery 1 of the W11 workshop).
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-NOT-001 | Receive Reservation Confirmation (observability workshop, CP0 to CP4) | doing | https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop |

## 2. My individual contribution
- Mapped the journey reserve, pay and confirm across ftx-front, API Gateway, auth-service, reservation, payment and notifications, with the trace propagation of each hop (CP1).
- Defined the structured log contract with domain fields, a never-log list and seven sample lines for one trace (CP2).
- Added the trace-context middleware, the structured logger, downstream propagation, two metrics and an automated test (CP3).
- Defined the golden signals and the metric catalog for reservation, API Gateway and payment (CP4).

## 3. Blockers and risks
- The endpoint paths in 01-journey.md still need to be checked against the OpenAPI files of ftx-docs.
- HOW-TO-RUN.md and the reflection entries are still being completed.
- Delivery 2 (CP6 to CP10) is pending.

## 4. Plan for next week
- Finish HOW-TO-RUN.md with the real console output.
- Complete delivery 2: SLOs, alerts, runbook, incident and postmortem (CP6 to CP10).

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Workshop folder: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
- CP1 journey commit: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/commit/e560b68
- CP3 propagation and metrics commit: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/commit/aa7bf8c
