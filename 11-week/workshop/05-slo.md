# CP6 - SLIs, SLOs and error budget

Journey: reserve a field, pay and receive the confirmation (HU-RES-002, HU-PAY-001, HU-NOT-001).
All metric names come from 04-metrics.md. The window of every SLO is 30 days.

## SLOs

| SLO | SLI formula | PromQL | Objective | Window |
|---|---|---|---|---|
| Availability of the reservation | good requests / valid requests | `sum(rate(reservation_requests_total{result=~"created\|rejected"}[30d])) / sum(rate(reservation_requests_total[30d]))` | 99.5 % | 30 days |
| Latency of the reservation | requests answered in 1 s or less / all requests | `sum(rate(reservation_request_duration_seconds_bucket{le="1"}[30d])) / sum(rate(reservation_request_duration_seconds_count[30d]))` | 95 % | 30 days |
| Payment hold on time | payment holds without timeout / all payment holds | `1 - (sum(rate(payment_hold_requests_total{result="timeout"}[30d])) / sum(rate(payment_hold_requests_total[30d])))` | 99 % | 30 days |

A reservation rejected because the slot is taken (reservation.rejected.slot_taken) is a valid and correct answer, so it counts as good. Only error and timeout results count as bad.

The 1 s limit comes from the latency buckets of CP4: a player who confirms a reservation expects an answer in about one second.

## Traffic estimate

This is an estimate, not a measurement. Replace the values with the ones you can justify.

| Value | Number | Reason |
|---|---|---|
| Fields | 4 | assumption for one sports complex |
| Hourly slots per field per day | 16 | the fields are open from 6:00 to 22:00 |
| Occupancy | 60 % | assumption |
| Attempts per confirmed reservation | 2 | retries and slots already taken |

Reservations per day: 4 x 16 x 0.60 = 38.4, about 38.
Attempts per day: 38 x 2 = 76, about 80.
Attempts in 30 days: 80 x 30 = 2,400 requests.
Minutes in 30 days: 30 x 24 x 60 = 43,200 minutes.

## Error budget

| SLO | Objective | Budget | In requests (2,400) | In minutes (43,200) |
|---|---|---|---|---|
| Availability | 99.5 % | 0.5 % | 12 requests | 216 minutes |
| Latency | 95 % | 5 % | 120 requests | 2,160 minutes |
| Payment hold | 99 % | 1 % | 24 requests | 432 minutes |

Formula: budget = 100 % - SLO. Requests = total x budget. Minutes = 43,200 x budget.

## Error budget policy

| Consumed | What the team does |
|---|---|
| 50 % | Review the failing requests in the weekly meeting and put the reliability fixes first in the backlog. |
| 75 % | Stop risky changes and non-urgent features. Only fixes and stabilization are merged to develop. |
| 100 % | Freeze feature releases to qa and main until the budget recovers. Every incident gets a blameless postmortem. |
