'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { getCourt } = require('./outbound');
const { parseTraceparent } = require('./trace-context');
const { traceMiddleware } = require('./middleware');
const { observe, render } = require('./metrics');

test('trace_id received is the same trace_id sent to court-service', async () => {
  const incomingId = '7c1d9e0a5b3f48e2a6d4c8b21f903e5a';
  const headers = { traceparent: `00-${incomingId}-a1b2c3d4e5f60718-01` };
  const res = { setHeader() {} };
  const ctx = traceMiddleware({ headers }, res);

  let sent;
  const fakeFetch = async (url, options) => { sent = options.headers.traceparent; return { status: 200 }; };
  await getCourt(ctx, 'http://court-service.local/api/v1', '7c0f4c3e', fakeFetch);

  assert.strictEqual(parseTraceparent(sent).traceId, incomingId);
  assert.notStrictEqual(parseTraceparent(sent).spanId, 'a1b2c3d4e5f60718');
});

test('metrics expose the counter and the histogram', () => {
  observe('created', 0.2);
  const text = render();
  assert.match(text, /reservation_requests_total\{result="created"\} 1/);
  assert.match(text, /reservation_request_duration_seconds_count 1/);
});
