# How to run the security checks

Story covered: "[security] Verify Wompi webhook signature in constant time and reject old events"
(Risk 6, STRIDE S, PR https://github.com/code-corhuila/ftx-docs/pull/59).

Criterion covered: a POST /api/v1/payments/wompi/webhook with an invalid X-Event-Checksum is rejected
(401) and the webhook handler is never called, so the payment does not change.

## Run the negative test locally

Requirements: Java 21 and Maven, in the payment-service repository.

    mvn -B test -Dtest=WompiWebhookSignatureTest

The test expects HTTP 401 and checks that the handler is not called.

## What the workflow does

security.yml runs on every pull request with three gates:

1. gitleaks scans the repository for secrets.
2. OWASP dependency-check audits the Maven dependencies (it fails on CVSS 7 or higher).
3. The negative test above runs.

If one step fails, the pull request is blocked and the story stays open.

## Evidence of the run

Negative test run on 2026-10-30 (Windows 11, Temurin JDK 21.0.13, Maven 3.9.16, Spring Boot 3.3.5):

```
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  15.227 s
[INFO] Finished at: 2026-10-30T18:34:02-05:00
```

Result: the invalid X-Event-Checksum gets 401 and the handler is never called (verify never()).

Workflow validation: security.yml checked with yamllint.com on 2026-10-30, result: Valid YAML.

## Notes

- This workflow is a proposal for the team pipeline. It lives in my fork, not in the team code repository.
- The test was run in a small local project (payment-webhook-demo) that reproduces the controller, the signature
  verifier and the handler, because payment-service does not exist in the team repository yet.
