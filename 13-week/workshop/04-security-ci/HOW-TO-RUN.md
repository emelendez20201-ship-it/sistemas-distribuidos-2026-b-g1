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

## Notes

- This workflow is a proposal for the team pipeline. It lives in my fork, not in the team code repository.
- The class names WompiWebhookController, WompiSignatureVerifier and WebhookHandler follow the example in
  00-governance/security-rules.md and must be adapted to the real names when payment-service exists.
