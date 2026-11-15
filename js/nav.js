(function () {
    var PAGE_ORDER = [
        { id: "atelier", file: "index.html", label: "L'Atelier" },
        { id: "realisations", file: "realisations/index.html", label: "Mes réalisations" },
        { id: "services", file: "services/index.html", label: "Mes services" },
        { id: "projet", file: "soumission/index.html", label: "Démarrer un projet" },
        { id: "contact", file: "contact/index.html", label: "Contact" }
    ];

    var nav = document.getElementById("site-nav");
    var root = "";
    var active = "";

    if (nav) {
        root = nav.getAttribute("data-root") || "";
        active = nav.getAttribute("data-active") || "";
        nav.innerHTML = PAGE_ORDER.map(function (item) {
            var current = item.id === active ? ' aria-current="page"' : "";
            return '<a href="' + root + item.file + '"' + current + ">" + item.label + "</a>";
        }).join("");
    }

    var toggle = document.querySelector(".nav-toggle");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function mountPageChrome() {
        if (!active) return;
        if (document.getElementById("site-page-chrome")) return;

        var index = -1;
        for (var i = 0; i < PAGE_ORDER.length; i++) {
            if (PAGE_ORDER[i].id === active) {
                index = i;
                break;
            }
        }
        if (index < 0) return;

        var prev = index > 0 ? PAGE_ORDER[index - 1] : null;
        var next = index < PAGE_ORDER.length - 1 ? PAGE_ORDER[index + 1] : null;
        /* Pas de flèches fantômes ; Mes services : aucune flèche latérale. */
        var showSideArrows = active !== "services";

        var chrome = document.createElement("div");
        chrome.id = "site-page-chrome";
        chrome.className = "site-page-chrome";
        chrome.innerHTML =
            (showSideArrows && prev
                ? '<a class="site-page-arrow site-page-arrow--prev" href="' + root + prev.file + '" aria-label="Page précédente : ' + prev.label + '" title="' + prev.label + '">‹</a>'
                : "") +
            (showSideArrows && next
                ? '<a class="site-page-arrow site-page-arrow--next" href="' + root + next.file + '" aria-label="Page suivante : ' + next.label + '" title="' + next.label + '">›</a>'
                : "") +
            '<button type="button" class="site-back-top" id="site-back-top" aria-label="Remonter en haut" hidden>↑</button>';

        document.body.appendChild(chrome);

        var backTop = document.getElementById("site-back-top");
        var showAfter = 280;

        function syncBackTop() {
            if (!backTop) return;
            if (window.scrollY > showAfter) {
                backTop.removeAttribute("hidden");
            } else {
                backTop.setAttribute("hidden", "");
            }
        }

        backTop.addEventListener("click", function () {
            var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        });

        window.addEventListener("scroll", syncBackTop, { passive: true });
        syncBackTop();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountPageChrome);
    } else {
        mountPageChrome();
    }
})();
