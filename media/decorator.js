// Bunnyforge Visibility Preview -- the classifier half.
// Stamps the built-in preview's front-matter table and the `GM notes`
// heading with mechanical hooks. ALL semantics (which keys matter, every
// colour) live in visibility.css; this file must never name a colour, and
// names exactly one key ("visibility", for the body stamp the stylesheet
// cannot derive). Every other row is stamped generically -- that is the
// seam that lets future fields (canon, status, summary, ...) be decorated
// by a CSS-only change.
(function () {
  "use strict";

  var VISIBILITY_VALUES = ["gm-only", "player-visible", "mixed"];

  function norm(text) {
    return String(text == null ? "" : text)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function decorate(doc) {
    var body = doc.body;
    if (!body) {
      return;
    }

    var visibility = null;
    var rows = doc.querySelectorAll("table.frontmatter tr");
    for (var i = 0; i < rows.length; i++) {
      var th = rows[i].querySelector("th");
      var td = rows[i].querySelector("td");
      if (!th || !td) {
        continue;
      }
      var key = norm(th.textContent);
      if (!key) {
        continue;
      }
      rows[i].setAttribute("data-key", key);
      if (td.children.length === 0) {
        var value = norm(td.textContent);
        rows[i].setAttribute("data-value", value);
        if (key === "visibility" && VISIBILITY_VALUES.indexOf(value) !== -1) {
          visibility = value;
        }
      } else {
        rows[i].removeAttribute("data-value");
      }
    }

    if (visibility) {
      body.setAttribute("data-visibility", visibility);
    } else {
      body.removeAttribute("data-visibility");
    }

    var marked = doc.querySelectorAll(".bfvis-gm-notes");
    for (var j = 0; j < marked.length; j++) {
      marked[j].classList.remove("bfvis-gm-notes");
    }
    var heading = doc.getElementById("gm-notes");
    if (heading) {
      heading.classList.add("bfvis-gm-notes");
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { decorate: decorate, norm: norm };
  }
})();
