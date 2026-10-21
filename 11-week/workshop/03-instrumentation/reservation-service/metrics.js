'use strict';

const BUCKETS = [0.05, 0.1, 0.25, 0.5, 1, 3];
const requests = new Map();
const latency = BUCKETS.map(() => 0);
let latencyCount = 0;
let latencySum = 0;

function observe(result, seconds) {
  requests.set(result, (requests.get(result) || 0) + 1);
  BUCKETS.forEach((b, i) => { if (seconds <= b) latency[i] += 1; });
  latencyCount += 1;
  latencySum += seconds;
}

function render() {
  const lines = ['# TYPE reservation_requests_total counter'];
  for (const [result, n] of requests) {
    lines.push(`reservation_requests_total{result="${result}"} ${n}`);
  }
  lines.push('# TYPE reservation_request_duration_seconds histogram');
  BUCKETS.forEach((b, i) => {
    lines.push(`reservation_request_duration_seconds_bucket{le="${b}"} ${latency[i]}`);
  });
  lines.push(`reservation_request_duration_seconds_bucket{le="+Inf"} ${latencyCount}`);
  lines.push(`reservation_request_duration_seconds_sum ${latencySum}`);
  lines.push(`reservation_request_duration_seconds_count ${latencyCount}`);
  return lines.join('\n') + '\n';
}

module.exports = { observe, render };
