# CP2 - Structured log contract

All services of the journey (api-gateway, reservation-service, court-service, payment-service) write one JSON object per line with these fields.

## Fields

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| timestamp | string ISO-8601 UTC | yes | 2026-10-20T19:20:01.120Z | order events across services |
| level | string | yes | ERROR | filter by severity |
| service | string | yes | reservation-service | know who wrote the line |
| version | string | yes | 2.0.0 | link a bug to a release tag |
| environment | string | yes | qa | separate dev, qa and main |
| trace_id | string 32 hex | yes | 4d7e1b9a2c6f45e8b3a0d9f1c2e86b57 | join all services of one request |
| span_id | string 16 hex | yes | a1b2c3d4e5f60718 | locate the exact hop |
| correlation_id | string | yes | res-2041 | business id shown to support |
| event | string | yes | court.lookup.timeout | stable name to search and alert on |
| message | string | yes | court-service did not answer in time | human reading |
| duration_ms | number | yes | 3004 | measure latency per hop |
| reservation_code | string | no | FTX7Q2K9M4 | code of the reservation (HU-RES-002) |
| reservation_id | string | no | 0c9e1c7a-5d2f-4b61-8a3e-2f7b9d4e6a10 | internal id of the reservation |
| court_id | string | no | 7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11 | know which court is affected |
| event_id | string | no | 5b1d2f6a-9c3e-4d70-b8a1-6e4c2d9f0a37 | follow a domain event such as ReservationCreated |

## Never log

| Data | How it is handled |
|---|---|
| customerName, customerEmail and customerPhone of the reservation | never written; if needed, email masked as j***@example.com and phone with only the last 2 digits |
| Card data | never reaches Futbolix, it goes to Wompi directly |
| Wompi webhook signature (X-Event-Checksum) and secrets | never written, only the event name PAYMENT_WEBHOOK_SIGNATURE_INVALID |
| Administrator password and JWT | password never written, token only the first 6 characters and `***` |

## Levels

| Level | When | Example in Futbolix |
|---|---|---|
| ERROR | the request failed and needs action | court-service did not answer in time |
| WARN | a business rule rejected the request | RESERVATION_SLOT_UNAVAILABLE, the slot is already taken |
| INFO | normal step of the journey | reservation created in PENDING status |
| DEBUG | detail for development only | parameters of the court lookup |

## Example lines (one trace)

The user action keeps one trace: ftx-front sends the same traceparent when it repeats the request with the same Idempotency-Key.

```json
{"timestamp":"2026-10-20T19:20:00.100Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"a1b2c3d4e5f60718","correlation_id":"res-2041","event":"reservation.request.received","message":"POST /api/v1/reservations received","duration_ms":4,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-20T19:20:00.140Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"b2c3d4e5f6071829","correlation_id":"res-2041","event":"reservation.create.started","message":"creating reservation","duration_ms":6,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-20T19:20:03.150Z","level":"ERROR","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"c3d4e5f607182930","correlation_id":"res-2041","event":"court.lookup.timeout","message":"court-service did not answer in time","duration_ms":3004,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-20T19:20:03.170Z","level":"WARN","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"a1b2c3d4e5f60718","correlation_id":"res-2041","event":"reservation.response.sent","message":"returned 503 to ftx-front","duration_ms":3071}
{"timestamp":"2026-10-20T19:20:05.200Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"d4e5f60718293041","correlation_id":"res-2041","event":"reservation.request.received","message":"same request repeated with the same Idempotency-Key","duration_ms":3,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-20T19:20:05.260Z","level":"WARN","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"e5f6071829304152","correlation_id":"res-2041","event":"reservation.rejected.slot_unavailable","message":"RESERVATION_SLOT_UNAVAILABLE, the slot was taken by another reservation","duration_ms":41,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11"}
{"timestamp":"2026-10-20T19:20:05.280Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4d7e1b9a2c6f45e8b3a0d9f1c2e86b57","span_id":"d4e5f60718293041","correlation_id":"res-2041","event":"reservation.response.sent","message":"returned 409 to ftx-front","duration_ms":80}
```
