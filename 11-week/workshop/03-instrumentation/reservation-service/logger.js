'use strict';

const BASE = {
  service: 'reservation-service',
  version: process.env.SERVICE_VERSION || '2.0.0',
  environment: process.env.APP_ENV || 'dev',
};

// One JSON line per event, following 02-log-contract.md.
function log(level, ctx, event, message, extra = {}) {
  const line = {
    timestamp: new Date().toISOString(),
    level,
    ...BASE,
    trace_id: ctx.traceId,
    span_id: ctx.spanId,
    correlation_id: extra.correlation_id || ctx.traceId.slice(0, 8),
    event,
    message,
    duration_ms: extra.duration_ms || 0,
    ...extra,
  };
  process.stdout.write(JSON.stringify(line) + '\n');
  return line;
}

module.exports = { log };
