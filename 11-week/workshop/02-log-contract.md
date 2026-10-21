# CP2 - Structured log contract

All services (API Gateway, auth-service, Reservation, Payment, Notifications) write one JSON object per line with these fields.

## Fields

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| timestamp | string ISO-8601 UTC | yes | 2026-10-20T19:20:01.120Z | order events across services |
| level | string | yes | ERROR | filter by severity |
| service | string | yes | reservation | know who wrote the line |
| version | string | yes | 2.0.0 | link a bug to a release tag |
| environment | string | yes | qa | separate dev, qa and main |
| trace_id | string 32 hex | yes | 7c1d9e0a5b3f48e2a6d4c8b21f903e5a | join all services of one request |
| span_id | string 16 hex | yes | a1b2c3d4e5f60718 | locate the exact hop |
| correlation_id | string | yes | res-2041 | business id shown to support |
| event | string | yes | payment.hold.timeout | stable name to search and alert on |
| message | string | yes | payment did not answer | human reading |
| duration_ms | number | yes | 3004 | measure latency per hop |
| reservation_id | string | no | R-2041 | follow the reservation (HU-RES-002) |
| court_id | string | no | C-03 | know which field is affected |
| schedule_id | string | no | S-118 | link to a court_schedule row |
| payment_id | string | no | P-9001 | follow the payment (HU-PAY-001) |

## Never log

| Data | How it is handled |
|---|---|
| Passwords | never written |
| JWT and access tokens | only the first 6 characters, then `***` |
| Card or payment data | never written, only payment_id |
| Email and phone of the player | masked, for example e***@mail.com |

## Levels

| Level | When | Example in Futbolix |
|---|---|---|
| ERROR | the request failed and needs action | payment did not answer in time |
| WARN | a business rule rejected the request | slot already taken in court_schedule |
| INFO | normal step of the journey | reservation created |
| DEBUG | detail for development only | schedule query parameters |

## Example lines (one trace)

```json
{"timestamp":"2026-10-20T19:20:00.101Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"a1b2c3d4e5f60718","correlation_id":"res-2041","event":"reservation.request.received","message":"create reservation request received","duration_ms":4,"court_id":"C-03"}
{"timestamp":"2026-10-20T19:20:00.140Z","level":"INFO","service":"auth-service","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"b2c3d4e5f6071829","correlation_id":"res-2041","event":"auth.token.validated","message":"token is valid","duration_ms":31}
{"timestamp":"2026-10-20T19:20:00.210Z","level":"INFO","service":"reservation","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"c3d4e5f607182930","correlation_id":"res-2041","event":"schedule.hold.created","message":"slot held for payment","duration_ms":58,"court_id":"C-03","schedule_id":"S-118","reservation_id":"R-2041"}
{"timestamp":"2026-10-20T19:20:03.230Z","level":"ERROR","service":"reservation","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"d4e5f60718293041","correlation_id":"res-2041","event":"payment.hold.timeout","message":"payment did not answer in time","duration_ms":3004,"reservation_id":"R-2041","payment_id":"P-9001"}
{"timestamp":"2026-10-20T19:20:03.260Z","level":"INFO","service":"reservation","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"d4e5f60718293041","correlation_id":"res-2041","event":"schedule.hold.released","message":"slot released after payment timeout","duration_ms":12,"schedule_id":"S-118"}
{"timestamp":"2026-10-20T19:20:03.300Z","level":"WARN","service":"reservation","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"e5f6071829304152","correlation_id":"res-2041","event":"reservation.rejected.slot_taken","message":"slot was reserved by another request while payment was pending","duration_ms":9,"schedule_id":"S-118"}
{"timestamp":"2026-10-20T19:20:03.320Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"7c1d9e0a5b3f48e2a6d4c8b21f903e5a","span_id":"a1b2c3d4e5f60718","correlation_id":"res-2041","event":"reservation.response.sent","message":"returned 409 to ftx-front","duration_ms":3219}
```
