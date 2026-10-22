# CP8 - Runbook: ReservationAvailabilityFastBurn

Alert: ReservationAvailabilityFastBurn (critical). The reservation error ratio is above 7.2 % in 1 hour and in 5 minutes. At this speed the 30 day budget (12 requests, 216 minutes) is gone in about 2 days.
Journey: ftx-front, API Gateway, auth-service, reservation, payment, notifications (HU-RES-002, HU-PAY-001, HU-NOT-001).

## Symptoms

- Players see an error or wait about 3 seconds when they confirm a reservation.
- The alert ReservationAvailabilityFastBurn is firing.
- The logs show many lines with level ERROR and events like payment.hold.timeout.

## How to confirm

1. Error ratio of the last 5 minutes (it must be above 0.072):

```
sum(rate(reservation_requests_total{result!~"created|rejected"}[5m])) / sum(rate(reservation_requests_total[5m]))
```

2. Latency of the last 5 minutes (p95 above 1 second confirms slowness):

```
histogram_quantile(0.95, sum by (le) (rate(reservation_request_duration_seconds_bucket[5m])))
```

3. In the logs, filter level ERROR and service reservation for the last 15 minutes. Take one trace_id and search it in all services. The story of that request shows which hop failed. Look at the event name, for example payment.hold.timeout, and at duration_ms.

## First three mitigations (from lowest to highest risk)

| Step | Action | Risk | When to use it |
|---|---|---|---|
| 1 | Restart the payment container (docker compose restart) and check that the hold timeouts stop | low | the failing hop is payment and the container looks stuck |
| 2 | Roll back reservation and payment to the previous release tag and redeploy | medium | the errors started right after a new deploy |
| 3 | Put the reservation creation route of the API Gateway in maintenance, with a clear message for the player, so no slot is held while payment fails | high, players cannot reserve | steps 1 and 2 did not change the error ratio |

Step 3 depends on the gateway route configuration. The team has to confirm in qa that it can be done before it is needed in production.

## Escalation

| Time without improvement | Who is called | Why |
|---|---|---|
| 0 min | person on call | follows this runbook |
| 15 min | Hernando Antonio Martín Herrera, technical lead | decides rollback or maintenance |
| 15 min, if the failing hop is the schedule database | Danna Michelle Morales Losada, PostgreSQL infrastructure | database checks |
| 15 min, if notifications are failing | Edwin Meléndez Palomino, MongoDB infrastructure | MongoDB checks |

## How to verify the recovery

1. The error ratio query of step 1 stays below 0.072 for 15 minutes in a row.
2. The p95 latency is below 1 second.
3. The logs show reservation.response.sent with success for new requests, and no new payment.hold.timeout.
4. Close the incident, remove the maintenance message if it was used, and write the postmortem.
