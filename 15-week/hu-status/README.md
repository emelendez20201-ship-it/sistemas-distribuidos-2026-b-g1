# Weekly HU status — Week 15 (Nov 9 – Nov 15, 2026)

**Author:** Edwin Meléndez Palomino (`emelendez20201-ship-it`)
**Team:** Futbolix, group 1 · **Area:** infrastructure and schedules
**Release:** MVP 3 (`v3.0.0`)

> Adapt the headings to the template used in previous weeks if it differs.

## HU worked this week

| HU | Repository | Work | Status |
|---|---|---|---|
| HU-ADM-001 | `ftx-schedules-api` | Court schedule domain, bookable-slots rules, schedules schema access and calls to `ftx-courts-api` (PRs #2–#5, stacked) | Reviewed and approved; merge pending (no write access) |
| HU-ADM-001 | `ftx-schedules-db` | Network name fix for the platform (PR #6) | Open, owned by a teammate |
| Infra | `ftx-infra-postgres` | Shared PostgreSQL instance and roles; validation of PRs #12 and #13 | Review requested; validation on real Docker pending |
| Docs | `ftx-docs` | Runbooks RB-001 (PostgreSQL unavailable) and RB-002 (`ftx-schedules-api`) plus demo evidence (PR #69) | Open, review requested |

## What was delivered

- Brought up the complete platform on my machine with `ftx-workflow`: PostgreSQL, RabbitMQ, four migrations, four APIs and the gateway.
- Ran the end-to-end demo with injected failures: **20 PASS / 0 FAIL** (`demo-output-20261115-172716.txt`).
- Failure rehearsal: with PostgreSQL stopped, schedules answers **503 in about 2 s**; after it returns it answers **200 again without restarting the API**.
- Recorded the demo video (5 scenes, including the failure path).
- Fixed the `ftx-customers-api` startup problem (JWT private key must be one-line PKCS#8 base64).

## Evidence

- PR #69 in `ftx-docs`: runbooks and demo transcript.
- Demo video: https://drive.google.com/file/d/1K_BMUNiHh3nW5tkY-iYpUWs3uGiyzHGr/view?usp=sharing
- Approvals with comments on `ftx-schedules-api` PRs #2–#5.

## Blockers and next steps

- No write access to `ftx-schedules-api`: asked a teammate to merge #2 → #3 → #4 → #5 with a merge commit, deleting each branch after merging.
- Promote `ftx-schedules-api` and `ftx-schedules-db` through `qa` and a release branch to `main` and tag `v3.0.0` (needs the teacher's approval).
- Validate infra PR #13 on a real Docker engine and report on PR #12.
- Check the `CODEOWNERS` handle in `ftx-schedules-api` before requesting approval for `main`.
