/**
 * Artisan FM — consentement statistiques + GA4 (G-KTXKF9XQJD)
 * La balise gtag n’est chargée qu’après acceptation explicite.
 * Aucune donnée de formulaire n’est envoyée à Google.
 */
(function () {
  "use strict";

  var GA_ID = "G-KTXKF9XQJD";
  var STORAGE_KEY = "afm_stats_consent";
  var ACCEPTED = "accepted";
  var REFUSED = "refused";

  function getChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function isFormRelatedEvent(name) {
    if (!name) return false;
    var n = String(name).toLowerCase();
    return (
      n.indexOf("form_") === 0 ||
      n === "form_start" ||
      n === "form_submit" ||
      n === "generate_lead" ||
      n === "submit" ||
      n.indexOf("form") !== -1 && (n.indexOf("submit") !== -1 || n.indexOf("start") !== -1)
    );
  }

  function installGtagGuard() {
    if (typeof window.gtag !== "function" || window.__AFM_GTAG_GUARDED) return;
    window.__AFM_GTAG_GUARDED = true;
    var original = window.gtag;
    window.gtag = function () {
      var cmd = arguments[0];
      var name = arguments[1];
      if (cmd === "event" && isFormRelatedEvent(name)) {
        return;
      }
      if (cmd === "event" && arguments[2] && typeof arguments[2] === "object") {
        var payload = arguments[2];
        if (
          payload.form_id != null ||
          payload.form_name != null ||
          payload.form_destination != null ||
          payload.form_fields != null ||
          payload.field_name != null ||
          payload.field_value != null
        ) {
          return;
        }
      }
      return original.apply(this, arguments);
    };
  }

  function loadAnalytics() {
    if (window.__AFM_GA_LOADED) return;
    window.__AFM_GA_LOADED = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    installGtagGuard();

    gtag("js", new Date());
    gtag("config", GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true,
    });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.setAttribute("hidden", "");
    banner.setAttribute("aria-hidden", "true");
  }

  function showBanner() {
    if (document.getElementById("afm-consent-banner")) return;

    var banner = document.createElement("div");
    banner.id = "afm-consent-banner";
    banner.className = "afm-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "afm-consent-title");
    banner.setAttribute("aria-describedby", "afm-consent-desc");
    banner.innerHTML =
      '<div class="afm-consent__panel">' +
      '<p id="afm-consent-title" class="afm-consent__title">Statistiques de fréquentation</p>' +
      '<p id="afm-consent-desc" class="afm-consent__text">' +
      "Avec votre accord, Artisan FM utilise Google Analytics pour comprendre quelles pages sont consultées. " +
      "Aucune donnée de formulaire n’est envoyée. Vous pouvez refuser sans changer l’accès au site." +
      "</p>" +
      '<div class="afm-consent__actions">' +
      '<button type="button" class="afm-consent__btn afm-consent__btn--accept" data-afm-consent="accept">Accepter</button>' +
      '<button type="button" class="afm-consent__btn afm-consent__btn--refuse" data-afm-consent="refuse">Refuser</button>' +
      "</div>" +
      "</div>";

    banner.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-afm-consent]");
      if (!btn) return;
      var action = btn.getAttribute("data-afm-consent");
      if (action === "accept") {
        setChoice(ACCEPTED);
        hideBanner(banner);
        loadAnalytics();
      } else if (action === "refuse") {
        setChoice(REFUSED);
        hideBanner(banner);
      }
    });

    document.body.appendChild(banner);
  }

  function init() {
    var choice = getChoice();
    if (choice === ACCEPTED) {
      loadAnalytics();
      return;
    }
    if (choice === REFUSED) {
      return;
    }
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
