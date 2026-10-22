# CP9 - Incident drill and blameless postmortem

Scenario: court-service, the dependency below the hop 3 of the CP1 journey (reservation-service to court-service, GET /courts/{id}), answers in 3 seconds for 25 % of the requests during 40 minutes (from 19:00 to 19:40).
Assumptions of the drill: reservation-service waits at most 3 seconds and then answers 503 (ftx-front waits up to 10 seconds, VITE_API_TIMEOUT_MS in src/config.ts, so the customer receives the 503 and not a browser timeout), and the 40 minutes fall in the evening peak with 32 reservation requests evenly spread. The monthly estimate of CP6 is 2,400 requests.

## Trace of a slow request

trace_id 9f2a64c1d7b84e3aa5c0b1e8d2f7a613

- gateway.create_reservation (root), 3,219 ms
  - reservation.create, 3,150 ms
    - court.get_court, 3,004 ms, timeout
    - reservation.insert_with_outbox, not reached
  - reservation.publish_created, not reached, so payment-service never receives ReservationCreated

## Four log lines of that trace

```json
{"timestamp":"2026-10-21T19:10:00.100Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"main","trace_id":"9f2a64c1d7b84e3aa5c0b1e8d2f7a613","span_id":"1a2b3c4d5e6f7081","correlation_id":"res-3307","event":"reservation.request.received","message":"POST /api/v1/reservations received","duration_ms":4,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-21T19:10:00.140Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"main","trace_id":"9f2a64c1d7b84e3aa5c0b1e8d2f7a613","span_id":"2b3c4d5e6f708192","correlation_id":"res-3307","event":"reservation.create.started","message":"creating reservation","duration_ms":6,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-21T19:10:03.150Z","level":"ERROR","service":"reservation-service","version":"2.0.0","environment":"main","trace_id":"9f2a64c1d7b84e3aa5c0b1e8d2f7a613","span_id":"3c4d5e6f70819203","correlation_id":"res-3307","event":"court.lookup.timeout","message":"court-service did not answer in time","duration_ms":3004,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-21T19:10:03.170Z","level":"WARN","service":"api-gateway","version":"2.0.0","environment":"main","trace_id":"9f2a64c1d7b84e3aa5c0b1e8d2f7a613","span_id":"1a2b3c4d5e6f7081","correlation_id":"res-3307","event":"reservation.response.sent","message":"returned 503 to ftx-front","duration_ms":3071}
```

## SLIs during the 40 minutes

| SLO | Objective | SLI in the incident | Calculation |
|---|---|---|---|
| Availability | 99.5 % | 75 % | 24 good of 32 requests |
| Latency (1 s or less) | 95 % | 75 % | the 8 slow requests took 3 s |
| Court lookup on time | 99 % | 75 % | 8 timeouts of 32 lookups |

## Which alert fires first

The alert ReservationAvailabilityFastBurn fires at minute 18 (19:18). With 0.8 requests per minute and 25 % failures, the 1 hour error ratio is 0.2 x t / 48. It passes 7.2 % when t is above 17.3 minutes. The 5 minute window is already at 25 %.
The alert ReservationAvailabilitySlowBurn does not fire. Its 6 hour ratio is 0.2 x t / 288 and it needs more than 43.2 minutes to pass 3 %. The incident stops at minute 40.

## Runbook step that stops the damage

Step 3 of 07-runbook.md, the maintenance response in the api-gateway route, at 19:40. Steps 1 (restart court-service, 19:28) and 2 (redeploy the previous tag, 19:34) did not change the error ratio, because the cause was in the dependency and not in a deploy.

## Postmortem (blameless)

### Timeline

| Time | Event |
|---|---|
| 19:00 | court-service starts answering in 3 s for 25 % of the requests |
| 19:18 | ReservationAvailabilityFastBurn fires |
| 19:21 | The On-Call Engineer acknowledges the alert and opens the runbook |
| 19:25 | The error ratio and the trace_id search confirm court.lookup.timeout |
| 19:28 | Step 1: court-service restarted, no change |
| 19:34 | Step 2: previous tag redeployed, no change |
| 19:40 | Step 3: maintenance response in the gateway, customers stop waiting |
| 19:55 | The error ratio is below 0.072 for 15 minutes, incident closed |

### Impact

- 8 failed requests of 32 in the incident window, and no payment recorded for them because ReservationCreated was never published.
- Request budget: 8 of 12, that is 66.7 % of the monthly budget. The 50 % level of the error budget policy was passed, the 75 % level was not.
- Time budget: 25 % x 40 minutes = 10 equivalent minutes of 216, that is 4.6 %. The two numbers differ because the drill puts 32 requests in 40 minutes, much more than the monthly average of about 3.3 per hour. The request view is the one the SLI uses.

### Root cause

court-service answered slowly for part of the requests, and reservation-service waited the full 3 seconds each time because it has no circuit breaker on that call.

### Contributing factors

- The metrics of the court lookup are planned in the CP4 catalog and are not in the code, so the slow dependency was not visible on its own.
- ADR-010 of ftx-docs says that reservation-service, court-service and payment-service do not exist in code yet, so none of the contracts has been tested under load.
- The fast alert needs 18 minutes to fire when the failure is 25 %.

### Actions

1. As the On-Call Engineer, I want a circuit breaker on the call to court-service, so that slow calls do not wait 3 seconds.
   Acceptance: after 5 consecutive timeouts the circuit opens; POST /reservations answers in less than 1 second with a clear 503 message; an automated test shows it.
2. As the team, I want reservation-service to expose reservation_court_lookup_requests_total and reservation_court_lookup_duration_seconds, so that the slow dependency is visible.
   Acceptance: /metrics shows both names; the PromQL of 04-metrics.md returns values.
3. As the On-Call Engineer, I want step 3 of the runbook to be a documented and tested action, so that I can stop the damage in less than 5 minutes.
   Acceptance: in qa the maintenance response returns its message in less than 1 second; the exact steps are written in 07-runbook.md; it is repeated in the next drill.
