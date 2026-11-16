<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Edwin Meléndez Palomino
- GITHUB_USER: emelendez20201-ship-it
- TEAM: Futbolix
- SPRINT_GOAL: Integrate and operate MVP 3: bring up the complete platform, run the end-to-end demo with injected failures, and document the runbooks for the schedules domain and PostgreSQL.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-ADM-001 | Court schedules: domain, bookable slots and schedules API (reviewed and approved, stacked PRs 1 to 4) | doing | https://github.com/code-corhuila/ftx-schedules-api/pull/2 |

## 2. My individual contribution
- Brought up the complete platform on my machine with ftx-workflow (PostgreSQL, RabbitMQ, four Flyway migrations, four APIs and the gateway) and ran the end-to-end demo with injected failures: 20 PASS / 0 FAIL.
- Rehearsed the PostgreSQL outage: while it is down ftx-schedules-api answers 503 in about 2 s, and after it returns it answers 200 again without restarting the API.
- Fixed the ftx-customers-api startup problem (the JWT private key must be one-line PKCS#8 base64) so the platform could start.
- Wrote and published runbooks RB-001 (PostgreSQL unavailable, with the rehearsal evidence) and RB-002 (ftx-schedules-api) and added the demo transcript to ftx-docs (PR #69).
- Reviewed and approved ftx-schedules-api PRs #2 to #5 (HU-ADM-001), and recorded the demo video with the failure path.

## 3. Blockers and risks
- I have no write access to ftx-schedules-api, so the merge of PRs #2 to #5 depends on a teammate; I asked for them to be merged in order with a merge commit.
- Promotion to qa and main, and the v3.0.0 tag, need the teacher's approval before the deadline.
- GitHub Actions is blocked by the organization billing, so checks were run locally.

## 4. Plan for next week
- Promote ftx-schedules-api and ftx-schedules-db through qa and a release branch to main and tag v3.0.0.
- Validate infra PR #13 (ftx-infra-postgres) on a real Docker engine and report on PR #12.
- Check the CODEOWNERS handle in ftx-schedules-api.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Runbooks and demo transcript: https://github.com/code-corhuila/ftx-docs/pull/69
- Demo video: https://drive.google.com/file/d/1K_BMUNiHh3nW5tkY-iYpUWs3uGiyzHGr/view?usp=sharing
- Schedules API PRs reviewed: https://github.com/code-corhuila/ftx-schedules-api/pull/2, /3, /4 and /5
