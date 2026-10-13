# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Edwin Meléndez Palomino
- GITHUB_USER: emelendez20201-ship-it
- TEAM: Futbolix
- SPRINT_GOAL: Close MVP 2: tag v2.0.0 on main, publish the release and deliver the versioned package of ftx-infra-mongo, and review the delivered work against the course policies.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-NOT-001 | Receive Reservation Confirmation (MongoDB infrastructure for notifications and history): release v2.0.0 | done | https://github.com/code-corhuila/ftx-infra-mongo/releases/tag/v2.0.0 |

## 2. My individual contribution

- Verified that PR #4 (release.2.0.0 -> main) was approved and merged, and that main carries the `cherry picked from` trail of the promotion (develop `b978feb` and qa `31fb370`).
- Created the `v2.0.0` tag on main (`73ce67e`) and published the release with its notes.
- Generated and verified the delivery package `ftx-infra-mongo-v2.0.0.zip` (docker-compose, env examples, init script, ADR-001, README, CODEOWNERS; no real `.env` files).
- Reviewed ftx-docs (branching policy, environments, ADR-001 documentation language) against the delivered repository and documented the gaps found.
- Updated the weekly status reports and prepared the evidence for the checkpoint defence.

## 3. Blockers and risks

- Documentation of ftx-infra-mongo is written in Spanish, while ADR-001 of ftx-docs requires English for all technical artifacts.
- The release branch was named `release.2.0.0`; the branching policy uses `release/`.
- PRs into qa and main were squash-merged; the policy asks for a merge commit. The `cherry picked from` lines survived in the final commit message.
- Automated review findings still open: domain provisioning inside the infra repo, MongoDB port published on all interfaces on main, and ADR-001 still marked "Proposed".

## 4. Plan for next week

- Publish a corrective v2.0.1 through develop -> qa -> release -> main: English documentation, ADR-001 set to "Accepted", `127.0.0.1` port binding and required variables in docker-compose.
- Move the notifications database provisioning to the domain `-db` repository.
- Use `type(scope): summary` in every commit and merge commits for PRs into qa and main.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Release v2.0.0: https://github.com/code-corhuila/ftx-infra-mongo/releases/tag/v2.0.0
- PR #4 (main): https://github.com/code-corhuila/ftx-infra-mongo/pull/4
- Weekly status week 09: https://github.com/emelendez20201-ship-it/sistemas-distribuidos-2026-b-g1/blob/main/09-week/hu-status/README.md
