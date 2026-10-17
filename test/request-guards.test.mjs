import test from "node:test";
import assert from "node:assert/strict";
import { isSameOriginRequest, readJsonBounded } from "../lib/http/request-guards.mjs";

test("same-origin guard accepts only a matching Origin and Host", () => {
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/checkout", {
    method: "POST", headers: { origin: "https://shop.example", host: "shop.example" },
  })), true);
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/checkout", {
    method: "POST", headers: { origin: "https://evil.example", host: "shop.example" },
  })), false);
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/checkout", {
    method: "POST", headers: { host: "shop.example" },
  })), false);
});

test("bounded JSON parser accepts small JSON and rejects malformed or oversized bodies", async () => {
  const valid = await readJsonBounded(new Request("https://shop.example", {
    method: "POST", body: JSON.stringify({ items: [] }), headers: { "content-type": "application/json" },
  }), 128);
  assert.deepEqual(valid, { ok: true, value: { items: [] } });

  const tooLarge = await readJsonBounded(new Request("https://shop.example", {
    method: "POST", body: JSON.stringify({ value: "x".repeat(256) }),
  }), 64);
  assert.deepEqual(tooLarge, { ok: false, tooLarge: true });

  const malformed = await readJsonBounded(new Request("https://shop.example", {
    method: "POST", body: "{invalid",
  }), 64);
  assert.deepEqual(malformed, { ok: false, tooLarge: false });
});
