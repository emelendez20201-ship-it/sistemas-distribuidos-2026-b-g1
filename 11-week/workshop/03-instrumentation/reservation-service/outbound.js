'use strict';
const { childContext, formatTraceparent } = require('./trace-context');

// Reads the court from court-service (GET /courts/{id}, hop 3 of the journey)
// keeping the same trace_id.
async function getCourt(ctx, baseUrl, courtId, fetchImpl = fetch) {
  const child = childContext(ctx);
  return fetchImpl(`${baseUrl}/courts/${courtId}`, {
    method: 'GET',
    headers: { traceparent: formatTraceparent(child) },
  });
}

module.exports = { getCourt };
