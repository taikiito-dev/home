(function () {
  "use strict";

  var DEFAULT_LANG = "en";

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-lang-content]");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.getAttribute("data-lang-content") === lang) {
        node.classList.add("is-active");
      } else {
        node.classList.remove("is-active");
      }
    }
    document.documentElement.setAttribute("lang", lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Always start on English, every visit - no persisted preference.
    // (Previously stored the toggle choice in localStorage, which meant
    // a single click during a browsing session made every later page
    // load open in Japanese instead of English by default.)
    var currentLang = DEFAULT_LANG;
    applyLang(currentLang);

    var toggle = document.getElementById("lang-toggle");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "ja" : "en";
      applyLang(currentLang);
    });
  });
})();
