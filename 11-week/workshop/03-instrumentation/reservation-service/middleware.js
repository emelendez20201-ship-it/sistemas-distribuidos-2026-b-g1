'use strict';
const { newTraceContext, parseTraceparent, formatTraceparent } = require('./trace-context');

// Reads traceparent from the request or creates a new context,
// and returns the same header in the response.
function traceMiddleware(req, res) {
  const incoming = parseTraceparent(req.headers['traceparent']);
  const ctx = incoming || newTraceContext();
  res.setHeader('traceparent', formatTraceparent(ctx));
  return ctx;
}

module.exports = { traceMiddleware };
