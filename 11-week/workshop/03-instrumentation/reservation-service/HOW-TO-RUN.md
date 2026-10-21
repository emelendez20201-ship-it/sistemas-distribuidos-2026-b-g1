# How to run

Requirements: Node.js 18 or later. No dependencies to install.

    cd 11-week/workshop/03-instrumentation/reservation-service
    node --test

Console output on my machine (Node v24.22.0, Windows):

    ✔ trace_id received is the same trace_id sent to payment (2.6364ms)
    ✔ metrics expose the counter and the histogram (0.8297ms)
    ℹ tests 2
    ℹ suites 0
    ℹ pass 2
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 993.3653
