// Unit tests for the worker's response helpers and store-key constants.
//
// The application is a 2020 Cloudflare Worker: its data routes depend on
// a KV namespace (the `COVID19` global in store.js) and on upstream APIs
// that no longer exist, so the routes cannot be exercised headlessly.
// What CAN be tested without those services — and is tested here — is
// the response-shaping layer every route returns through (api.js) and
// the store-key constants the routes are keyed on (constants.js).
// Node's fetch-API globals (Response) are the same primitives the
// Workers runtime provides.

import { test } from "node:test";
import assert from "node:assert/strict";

import { rawResponse, successResponse, errorResponse } from "../api.js";
import { STORE_KEYS } from "../constants.js";

test("rawResponse passes string data through with JSON headers", async () => {
  const res = rawResponse('{"a":1}');
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /application\/json/);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.equal(await res.text(), '{"a":1}');
});

test("rawResponse serialises object data to JSON", async () => {
  const res = rawResponse({ loc: "Kerala", confirmed: 42 });
  assert.deepEqual(JSON.parse(await res.text()), { loc: "Kerala", confirmed: 42 });
});

test("successResponse wraps data in the success envelope", async () => {
  const res = successResponse({ total: 7 });
  const body = JSON.parse(await res.text());
  assert.equal(body.success, true);
  assert.deepEqual(body.data, { total: 7 });
  assert.ok(!Number.isNaN(Date.parse(body.lastRefreshed)));
  assert.ok(!Number.isNaN(Date.parse(body.lastOriginUpdate)));
});

test("errorResponse wraps details in the failure envelope with status", async () => {
  const res = await errorResponse({ message: "boom" }, undefined, 503);
  assert.equal(res.status, 503);
  const body = JSON.parse(await res.text());
  assert.equal(body.success, false);
  assert.deepEqual(body.error, { message: "boom" });
});

test("store keys are unique, non-empty strings", () => {
  const values = Object.values(STORE_KEYS);
  assert.ok(values.length >= 10);
  for (const v of values) {
    assert.equal(typeof v, "string");
    assert.ok(v.length > 0);
  }
  assert.equal(new Set(values).size, values.length);
  assert.equal(STORE_KEYS.CASE_COUNTS, "case_counts");
});
