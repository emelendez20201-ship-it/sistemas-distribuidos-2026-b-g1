'use strict';
const crypto = require('node:crypto');

const TRACEPARENT = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

function newTraceContext() {
  return {
    traceId: crypto.randomBytes(16).toString('hex'),
    spanId: crypto.randomBytes(8).toString('hex'),
    flags: '01',
  };
}

function parseTraceparent(header) {
  const match = TRACEPARENT.exec(header || '');
  if (!match) return null;
  return { traceId: match[1], spanId: match[2], flags: match[3] };
}

function formatTraceparent(ctx) {
  return `00-${ctx.traceId}-${ctx.spanId}-${ctx.flags}`;
}

// Same trace, new span: used for every outgoing call.
function childContext(ctx) {
  return { ...ctx, spanId: crypto.randomBytes(8).toString('hex') };
}

module.exports = { newTraceContext, parseTraceparent, formatTraceparent, childContext };
