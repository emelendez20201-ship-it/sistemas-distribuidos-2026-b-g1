'use strict';
const { childContext, formatTraceparent } = require('./trace-context');

// Calls the payment step of the journey (HU-PAY-001) keeping the same trace_id.
async function holdPayment(ctx, url, fetchImpl = fetch) {
  const child = childContext(ctx);
  return fetchImpl(url, {
    method: 'POST',
    headers: { traceparent: formatTraceparent(child) },
  });
}

module.exports = { holdPayment };
