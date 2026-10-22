<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Edwin Meléndez Palomino
- GITHUB_USER: emelendez20201-ship-it
- TEAM: Futbolix
- SPRINT_GOAL: Complete the individual observability workshop on the Futbolix reservation journey: trace context, structured logs, metrics, SLOs, alerts, runbook and incident drill.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-NOT-001 | Receive Reservation Confirmation (observability workshop, CP0 to CP10) | done | https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop |

## 2. My individual contribution

- Mapped the real reservation journey from ftx-docs: ftx-front, api-gateway, reservation-service, court-service and the ReservationCreated event consumed by payment-service.
- Wrote the log contract (JSON fields, never-log list, seven lines of one trace) and the metric catalog for reservation-service, api-gateway and the court lookup.
- Implemented a W3C traceparent propagation and structured logging prototype in Node.js, with 2 passing tests (`node --test`, pass 2, fail 0) in `03-instrumentation/`.
- Defined three SLOs with error budgets from real data (4 courts, 16 slots per day) and stated assumptions, plus multi-window burn-rate alerts and an alert policy.
- Wrote the runbook for the fast-burn alert and ran an incident drill with a blameless postmortem (court-service slow for 40 minutes, 3 actions).
- Wrote the reflection document and the implementation plan for my project.

## 3. Blockers and risks

- ftx-front does not send `traceparent` yet (`src/api/client.ts` only sets Accept and Content-Type), so the trace would start at api-gateway.
- Services are not in code yet (ADR-010 proposes choreography), so the instrumentation is a prototype, not integrated.
- ftx-infra-mongo still provisions MongoDB for notifications, while ftx-docs removed the notification service. The team must decide its role.
- Repository names (ftx-schedules-api, ftx-courts-db) differ from the service name court-service used in ftx-docs.

## 4. Plan for next week

- Ask the team to add `traceparent` creation in ftx-front and propagation in api-gateway.
- Agree with the tech lead on the role of ftx-infra-mongo given the removal of notifications.
- Apply the log contract and the three SLOs to the services once they exist in code.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Workshop folder: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
- Runbook: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/07-runbook.md
- Incident drill and postmortem: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/08-incident.md
