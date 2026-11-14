(function () {
    var nav = document.getElementById("site-nav");
    if (nav) {
        var root = nav.getAttribute("data-root") || "";
        var active = nav.getAttribute("data-active") || "";
        var items = [
            { id: "atelier", href: root + "index.html", label: "L'Atelier" },
            { id: "realisations", href: root + "realisations/index.html", label: "Mes réalisations" },
            { id: "services", href: root + "univers/index.html", label: "Mes services" },
            { id: "projet", href: root + "soumission/index.html", label: "Démarrer un projet" },
            { id: "contact", href: root + "contact/index.html", label: "Contact" }
        ];
        nav.innerHTML = items.map(function (item) {
            var current = item.id === active ? ' aria-current="page"' : "";
            return '<a href="' + item.href + '"' + current + ">" + item.label + "</a>";
        }).join("");
    }

    var toggle = document.querySelector(".nav-toggle");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
})();
