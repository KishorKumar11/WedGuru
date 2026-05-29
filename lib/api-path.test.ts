import assert from "node:assert/strict";
import test from "node:test";
import { pathSegmentsFromQuery } from "./api-path.js";

test("pathSegmentsFromQuery returns empty for undefined", () => {
  assert.deepEqual(pathSegmentsFromQuery(undefined), []);
});

test("pathSegmentsFromQuery splits array segments", () => {
  assert.deepEqual(pathSegmentsFromQuery(["auth", "login"]), ["auth", "login"]);
});

test("pathSegmentsFromQuery splits slash-joined string", () => {
  assert.deepEqual(pathSegmentsFromQuery("auth/login"), ["auth", "login"]);
});
