<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Edwin Meléndez Palomino
- GITHUB_USER: emelendez20201-ship-it
- TEAM: Futbolix
- SPRINT_GOAL: Model the threats of one trust boundary of Futbolix (payment-service and the Wompi webhook) and turn them into security backlog stories and CI checks.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-NOT-001 | Threat modeling workshop: claim boundary and attack surface (CP0, CP1) | doing | https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop |

## 2. My individual contribution
- Claimed the trust boundary payment-service <- Wompi webhook with issue #47 in ftx-docs.
- Mapped the attack surface: data flow diagram, six assets and the entry points of my boundary, using ftx-docs (security-policy.md, the payment-service OpenAPI contract and overview.md).
- Registered a physical library book for the STRIDE analysis.

## 3. Blockers and risks
- STRIDE pull request (CP2), security stories (CP3) and the security workflow (CP4) are pending; I will deliver them separately with the required spacing between pushes.
- No peer review done yet: no teammate pull request to review at the time of class.

## 4. Plan for next week
- Open the STRIDE pull request on branch security/stride-emelendez20201-ship-it with two pushes.
- Create three [security] stories linked to the pull request.
- Add security.yml and one negative authorization test for payment-service.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Claim issue: https://github.com/code-corhuila/ftx-docs/issues/47
- Workshop folder: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop
- Attack surface: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/01-attack-surface.md
- Peer review comment: https://github.com/code-corhuila/ftx-docs/pull/49/changes#r4407772809.
