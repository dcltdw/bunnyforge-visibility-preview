"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadFixture } = require("./helpers");
const { decorate, norm } = require("../media/decorator");

test("norm collapses whitespace, trims, lowercases", () => {
  assert.equal(norm("  GM-Only \n"), "gm-only");
  assert.equal(norm("The  Coronation"), "the coronation");
});

test("stamps every scalar front-matter row with data-key and data-value", () => {
  const doc = loadFixture("preview.html").window.document;
  decorate(doc);
  for (const [key, value] of [
    ["visibility", "gm-only"],
    ["canon", "true"],
    ["status", "active"],
    ["reveal_when", "the coronation"],
  ]) {
    const row = doc.querySelector(`table.frontmatter tr[data-key="${key}"]`);
    assert.ok(row, `row for ${key} stamped`);
    assert.equal(row.getAttribute("data-value"), value);
  }
});

test("list-valued rows get data-key but no data-value", () => {
  const doc = loadFixture("preview.html").window.document;
  decorate(doc);
  const row = doc.querySelector('table.frontmatter tr[data-key="aliases"]');
  assert.ok(row);
  assert.equal(row.getAttribute("data-value"), null);
});

test("decorate is idempotent", () => {
  const doc = loadFixture("preview.html").window.document;
  decorate(doc);
  decorate(doc);
  assert.equal(
    doc.querySelectorAll('tr[data-key="visibility"]').length, 1);
  assert.equal(
    doc.querySelector('tr[data-key="visibility"]').getAttribute("data-value"),
    "gm-only");
});

test("a document with no front-matter table does not throw", () => {
  const { JSDOM } = require("jsdom");
  const doc = new JSDOM("<body><p>plain</p></body>").window.document;
  assert.doesNotThrow(() => decorate(doc));
});
