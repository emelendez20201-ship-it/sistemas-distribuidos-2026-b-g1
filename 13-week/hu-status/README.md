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
| HU-NOT-001 | Threat modeling workshop: STRIDE, security stories and CI check for payment-service <- Wompi webhook (CP0 to CP9) | done | https://github.com/code-corhuila/ftx-docs/pull/59 |

## 2. My individual contribution
- Claimed the trust boundary payment-service <- Wompi webhook with issue #47 in ftx-docs and mapped its attack surface (data flow diagram, six assets, entry points).
- Wrote the STRIDE analysis with risk ranking (probability x impact) in PR #59, using one physical library book as a source.
- Created three [security] stories in the team backlog: #60 (spoofing, risk 6, P1), #61 (information disclosure, risk 6, P1) and #62 (repudiation, risk 4, P2).
- Added security.yml (gitleaks, OWASP dependency-check, negative test) and WompiWebhookSignatureTest, and ran the test locally with 0 failures (see 04-security-ci/HOW-TO-RUN.md).

## 3. Blockers and risks
- The peer review of PR #59 was requested on 2026-10-30 but did not arrive; I documented the changes myself with the professor's authorization.
- Residual risk: no mTLS between services in the MVP (accepted, AT-003 in overview.md).
- The negative test runs in a small local demo project, because payment-service does not exist in the team repository yet.

## 4. Plan for next week
- Implement story #60 first: verify the X-Event-Checksum signature in constant time and reject old events.
- Then #61 (never log the secret, checksum or customer data) and #62.
- Move security.yml and the negative test into the real payment-service repository when it exists.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Claim issue: https://github.com/code-corhuila/ftx-docs/issues/47
- STRIDE pull request: https://github.com/code-corhuila/ftx-docs/pull/59
- Security stories: https://github.com/code-corhuila/ftx-docs/issues/60, /61 and /62
- Workshop folder: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop
- Negative test run: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/04-security-ci/HOW-TO-RUN.md
