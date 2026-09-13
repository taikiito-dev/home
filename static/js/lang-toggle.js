(function () {
  "use strict";

  var STORAGE_KEY = "taiki-lang";
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

  function getStoredLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore (e.g. private browsing) */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var currentLang = getStoredLang() || DEFAULT_LANG;
    applyLang(currentLang);

    var toggle = document.getElementById("lang-toggle");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "ja" : "en";
      applyLang(currentLang);
      storeLang(currentLang);
    });
  });
})();
