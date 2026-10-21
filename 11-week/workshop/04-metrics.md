# CP4 - Golden signals and metric catalog

Journey: reserve a field, pay and receive the confirmation (HU-RES-002, HU-PAY-001, HU-NOT-001).
Naming rules: snake_case, unit suffix (_seconds), counters end with _total.

## Reservation

| Signal | Metric | Type | Labels | PromQL for the dashboard | Status |
|---|---|---|---|---|---|
| Traffic | reservation_requests_total | counter | result | `sum(rate(reservation_requests_total[5m]))` | CP3 |
| Errors | reservation_requests_total | counter | result | `sum(rate(reservation_requests_total{result="error"}[5m])) / sum(rate(reservation_requests_total[5m]))` | CP3 |
| Latency | reservation_request_duration_seconds | histogram | none | `histogram_quantile(0.95, sum by (le) (rate(reservation_request_duration_seconds_bucket[5m])))` | CP3 |
| Saturation | reservation_inflight_requests | gauge | none | `max(reservation_inflight_requests)` | planned |

## API Gateway

| Signal | Metric | Type | Labels | PromQL for the dashboard | Status |
|---|---|---|---|---|---|
| Traffic | api_gateway_requests_total | counter | route, status_class | `sum by (route) (rate(api_gateway_requests_total[5m]))` | planned |
| Errors | api_gateway_requests_total | counter | route, status_class | `sum(rate(api_gateway_requests_total{status_class="5xx"}[5m])) / sum(rate(api_gateway_requests_total[5m]))` | planned |
| Latency | api_gateway_request_duration_seconds | histogram | route | `histogram_quantile(0.95, sum by (le, route) (rate(api_gateway_request_duration_seconds_bucket[5m])))` | planned |
| Saturation | api_gateway_inflight_requests | gauge | none | `max(api_gateway_inflight_requests)` | planned |

## Payment

| Signal | Metric | Type | Labels | PromQL for the dashboard | Status |
|---|---|---|---|---|---|
| Traffic | payment_hold_requests_total | counter | result | `sum(rate(payment_hold_requests_total[5m]))` | planned |
| Errors | payment_hold_requests_total | counter | result | `sum(rate(payment_hold_requests_total{result="timeout"}[5m])) / sum(rate(payment_hold_requests_total[5m]))` | planned |
| Latency | payment_hold_duration_seconds | histogram | none | `histogram_quantile(0.95, sum by (le) (rate(payment_hold_duration_seconds_bucket[5m])))` | planned |
| Saturation | payment_inflight_requests | gauge | none | `max(payment_inflight_requests)` | planned |

## Label cardinality

| Label | Allowed values | Series it creates |
|---|---|---|
| result | created, rejected, error, timeout | 4 |
| status_class | 2xx, 4xx, 5xx | 3 |
| route | route template such as /reservations, never the raw URL | one per endpoint |

Forbidden labels: reservation_id, court_id, schedule_id, payment_id, user_id, email and the raw URL. Each value would create a new series for every reservation or player. Those ids stay in the logs and are searched by trace_id.

## Histogram buckets

Buckets in seconds: 0.05, 0.1, 0.25, 0.5, 1, 3.

Reason: a player who confirms a reservation expects an answer in about one second, so the buckets are dense up to 1 s. The 3 s bucket matches the payment timeout used in the log contract, so a payment timeout shows up as the last bucket.
