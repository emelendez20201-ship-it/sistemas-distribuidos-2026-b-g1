# CP7 - Alert policy

SLO of the reservation availability: 99.5 % in 30 days, so the error budget is 0.5 %.
In the estimate of CP6 the budget is 12 requests and 216 minutes. 30 days are 720 hours.

## What each alert means

| Alert | Burn rate | Windows | Error ratio that fires it | Budget spent before it fires | In requests | In minutes |
|---|---|---|---|---|---|---|
| ReservationAvailabilityFastBurn | 14.4 | 1 h, confirmed in 5 min | 14.4 x 0.005 = 7.2 % | 14.4 x 1 / 720 = 2 % | 0.24 | 4.3 |
| ReservationAvailabilitySlowBurn | 6 | 6 h, confirmed in 30 min | 6 x 0.005 = 3 % | 6 x 6 / 720 = 5 % | 0.6 | 10.8 |

The fast alert is critical and pages the on-call person, because at that speed the whole budget is gone in about 2 days.
The slow alert is a warning and creates a ticket for working hours, because the damage is smaller but constant.

## Alerts we will not create

| Alert based on a cause | Why not |
|---|---|
| CPU of the reservation service above 80 % | High CPU can happen with no player affected, and a real failure can happen with low CPU. The burn rate alert already measures what the player feels. |
| Restart of a reservation pod | A restart that Kubernetes fixes in seconds does not break any reservation. If it does hurt players, the burn rate alert fires. |
