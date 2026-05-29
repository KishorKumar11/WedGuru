import assert from "node:assert/strict";
import test from "node:test";
import { themeAccentColor } from "../src/lib/theme-utils.js";

test("themeAccentColor returns last palette color", () => {
  assert.equal(themeAccentColor(["#ecf7fb", "#9ac9da", "#4f8ea8", "#1e5167"]), "#1e5167");
});

test("themeAccentColor falls back when palette empty", () => {
  assert.equal(themeAccentColor([]), "#6e304f");
});
