"use strict";
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

function loadFixture(name) {
  const html = fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
  return new JSDOM(
    `<!DOCTYPE html><html><body class="vscode-dark">${html}</body></html>`
  );
}

module.exports = { loadFixture };
