# CP8 - Runbook: ReservationAvailabilityFastBurn

Alert: ReservationAvailabilityFastBurn (critical). The error ratio of POST /reservations is above 7.2 % in 1 hour and in 5 minutes. At this speed the 30 day budget (12 requests, 216 minutes) is gone in about 2 days.
Journey: ftx-front, api-gateway, reservation-service, court-service, RabbitMQ and payment-service (HU-RES-002, HU-PAY-002).
It follows the playbook of 13-operations/incident-management.md in ftx-docs. The team runs Docker Compose, so every action uses containers.

## Symptoms

- Customers see an error or wait about 3 seconds when they create a reservation.
- The alert ReservationAvailabilityFastBurn is firing.
- The logs of reservation-service show many lines with level ERROR and the event court.lookup.timeout.

## How to confirm

1. Error ratio of the last 5 minutes (it must be above 0.072):

```
sum(rate(reservation_requests_total{result!~"created|rejected"}[5m])) / sum(rate(reservation_requests_total[5m]))
```

2. Which hop fails (timeouts of the call to court-service):

```
sum(rate(reservation_court_lookup_requests_total{result="timeout"}[5m])) / sum(rate(reservation_court_lookup_requests_total[5m]))
```

3. In the logs, filter level ERROR and service reservation-service for the last 15 minutes. Take one trace_id and search it in all services. The line with the event court.lookup.timeout and duration_ms close to 3000 shows that the hop to court-service is the slow one.

## First three mitigations (from lowest to highest risk)

| Step | Action | Risk | When to use it |
|---|---|---|---|
| 1 | Restart the court-service container with Docker Compose and check that the timeouts stop | low | the failing hop is court-service and it looks stuck |
| 2 | Redeploy the previous release tag of reservation-service and court-service with Docker Compose | medium | the errors started right after a new deploy |
| 3 | Activate the maintenance response in the api-gateway for POST /api/v1/reservations, with a clear message for the customer, so requests do not wait for a failing dependency | high, nobody can reserve | steps 1 and 2 did not change the error ratio |

Step 3 is the last resort of the incident playbook. The team has to confirm in qa that the gateway can answer the maintenance message before it is needed in production. The Gateway must not hold domain logic, so the message is a plain response of the route.

## Escalation (roles of 13-operations/incident-management.md)

| Time without improvement | Who | Why |
|---|---|---|
| 0 min | On-Call Engineer | follows this runbook and acknowledges the alert |
| 15 min | Incident Commander and Tech Lead (Hernando Antonio Martín Herrera) | classify the incident as P1, decide rollback or maintenance |
| 15 min, if court-service cannot read the schedules | Hernando Antonio Martín Herrera for the schedules schema (ftx-schedules-db) and Danna Michelle Morales Losada for the PostgreSQL instance (ftx-infra-postgres) | check the migrations, the roles and the container |

The team treats this as P1 because reservation is the core feature. The playbook table talks about more than 50 % of customers, so the Incident Commander confirms the level.

## How to verify the recovery

1. The error ratio of step 1 stays below 0.072 for 15 minutes in a row.
2. The p95 latency of reservation_request_duration_seconds is below 1 second.
3. The logs show reservation.response.sent with 201 for new requests, and no new court.lookup.timeout.
4. Remove the maintenance response if it was used, close the incident and write the postmortem.
