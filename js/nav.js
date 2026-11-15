(function () {
    var PAGE_ORDER = [
        { id: "atelier", file: "index.html", label: "L'Atelier" },
        { id: "realisations", file: "realisations/index.html", label: "Mes réalisations" },
        { id: "services", file: "services/index.html", label: "Mes services" },
        { id: "projet", file: "soumission/index.html", label: "Démarrer un projet" },
        { id: "contact", file: "contact/index.html", label: "Contact" }
    ];

    var CHEV_PREV =
        '<svg class="site-page-arrow__svg" viewBox="0 0 20 32" aria-hidden="true" focusable="false">' +
        '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M13 4 L5 16 L13 28"/>' +
        "</svg>";
    var CHEV_NEXT =
        '<svg class="site-page-arrow__svg" viewBox="0 0 20 32" aria-hidden="true" focusable="false">' +
        '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 4 L15 16 L7 28"/>' +
        "</svg>";

    var nav = document.getElementById("site-nav");
    var root = "";
    var active = "";
    var pageIndex = -1;
    var navigating = false;

    if (nav) {
        root = nav.getAttribute("data-root") || "";
        active = nav.getAttribute("data-active") || "";
        nav.innerHTML = PAGE_ORDER.map(function (item) {
            var current = item.id === active ? ' aria-current="page"' : "";
            return '<a href="' + root + item.file + '"' + current + ">" + item.label + "</a>";
        }).join("");
    }

    for (var i = 0; i < PAGE_ORDER.length; i++) {
        if (PAGE_ORDER[i].id === active) {
            pageIndex = i;
            break;
        }
    }

    var toggle = document.querySelector(".nav-toggle");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function goToIndex(index) {
        if (navigating || index < 0 || index >= PAGE_ORDER.length || index === pageIndex) return;
        navigating = true;
        window.location.href = root + PAGE_ORDER[index].file;
    }

    function goPrev() {
        goToIndex(pageIndex - 1);
    }

    function goNext() {
        goToIndex(pageIndex + 1);
    }

    function isBlockedTarget(target) {
        if (!target || !target.closest) return false;
        return !!target.closest(
            "input, textarea, select, option, [contenteditable='true'], " +
            ".real-carrousel, .real-lightbox, .site-nav, .nav-toggle"
        );
    }

    function mountPageChrome() {
        if (pageIndex < 0) return;
        if (document.getElementById("site-page-chrome")) return;

        var prev = pageIndex > 0 ? PAGE_ORDER[pageIndex - 1] : null;
        var next = pageIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[pageIndex + 1] : null;

        var chrome = document.createElement("div");
        chrome.id = "site-page-chrome";
        chrome.className = "site-page-chrome";
        chrome.innerHTML =
            (prev
                ? '<a class="site-page-arrow site-page-arrow--prev" href="' + root + prev.file + '" aria-label="Page précédente : ' + prev.label + '" title="' + prev.label + '">' + CHEV_PREV + "</a>"
                : "") +
            (next
                ? '<a class="site-page-arrow site-page-arrow--next" href="' + root + next.file + '" aria-label="Page suivante : ' + next.label + '" title="' + next.label + '">' + CHEV_NEXT + "</a>"
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
        bindHorizontalNav();
    }

    function bindHorizontalNav() {
        var wheelAcc = 0;
        var wheelReset = null;
        var touch = null;

        window.addEventListener(
            "wheel",
            function (e) {
                if (isBlockedTarget(e.target)) return;
                var dx = e.deltaX;
                var dy = e.deltaY;
                /* Trackpad horizontal, ou molette + Shift */
                if (e.shiftKey && Math.abs(dy) > Math.abs(dx)) {
                    dx = dy;
                }
                if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.15) {
                    wheelAcc = 0;
                    return;
                }
                wheelAcc += dx;
                if (wheelReset) window.clearTimeout(wheelReset);
                wheelReset = window.setTimeout(function () {
                    wheelAcc = 0;
                }, 180);
                if (Math.abs(wheelAcc) < 70) return;
                var dir = wheelAcc;
                wheelAcc = 0;
                if (dir > 0) goNext();
                else goPrev();
            },
            { passive: true }
        );

        window.addEventListener(
            "touchstart",
            function (e) {
                if (isBlockedTarget(e.target) || e.touches.length !== 1) {
                    touch = null;
                    return;
                }
                touch = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    t: Date.now(),
                    lock: null
                };
            },
            { passive: true }
        );

        window.addEventListener(
            "touchmove",
            function (e) {
                if (!touch || e.touches.length !== 1) return;
                var dx = e.touches[0].clientX - touch.x;
                var dy = e.touches[0].clientY - touch.y;
                if (!touch.lock) {
                    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
                    touch.lock = Math.abs(dx) > Math.abs(dy) * 1.2 ? "h" : "v";
                }
            },
            { passive: true }
        );

        window.addEventListener(
            "touchend",
            function (e) {
                if (!touch) return;
                var end = e.changedTouches[0];
                var dx = end.clientX - touch.x;
                var dy = end.clientY - touch.y;
                var elapsed = Date.now() - touch.t;
                var lock = touch.lock;
                touch = null;
                if (lock === "v") return;
                if (Math.abs(dx) < Math.abs(dy) * 1.15) return;
                var distanceOk = Math.abs(dx) >= 70;
                var flickOk = Math.abs(dx) >= 42 && Math.abs(dx) / Math.max(elapsed, 1) >= 0.35;
                if (!distanceOk && !flickOk) return;
                if (dx < 0) goNext();
                else goPrev();
            },
            { passive: true }
        );

        window.addEventListener("keydown", function (e) {
            if (isBlockedTarget(e.target)) return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountPageChrome);
    } else {
        mountPageChrome();
    }
})();
