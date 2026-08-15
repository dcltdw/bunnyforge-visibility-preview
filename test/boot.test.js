"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const FIXTURE = fs.readFileSync(
  path.join(__dirname, "fixtures", "preview.html"), "utf8");
const SOURCE = fs.readFileSync(
  path.join(__dirname, "..", "media", "decorator.js"), "utf8");

function bootDom() {
  const dom = new JSDOM(
    `<!DOCTYPE html><html><body class="vscode-dark">${FIXTURE}</body></html>`,
    { runScripts: "dangerously" });
  const script = dom.window.document.createElement("script");
  script.textContent = SOURCE;   // no `module` in this sandbox -> boot path
  dom.window.document.body.appendChild(script);
  return dom;
}

test("boots: decorates immediately when loaded as a browser script", () => {
  const doc = bootDom().window.document;
  assert.equal(doc.body.getAttribute("data-visibility"), "gm-only");
  assert.ok(doc.getElementById("gm-notes").classList.contains("bfvis-gm-notes"));
});

test("re-decorates after the preview patches the DOM", async () => {
  const doc = bootDom().window.document;
  const td = doc.querySelector('tr[data-key="visibility"] td');
  td.textContent = "mixed";                       // simulated in-place patch
  await new Promise((r) => setTimeout(r, 200));   // > 50ms debounce
  assert.equal(doc.body.getAttribute("data-visibility"), "mixed");
});
