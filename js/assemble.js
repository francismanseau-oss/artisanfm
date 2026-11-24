(function () {
    var scene = document.getElementById("assemble-scene");
    if (!scene) return;

    var copy = document.querySelector(".hero-assemble__copy");
    var ASPECT = 1024 / 682;
    var mqMobile = window.matchMedia("(max-width: 980px)");

    function fitSceneToCopy() {
        if (!copy) return;

        if (mqMobile.matches) {
            scene.style.height = "";
            scene.style.width = "";
            return;
        }

        var copyHeight = copy.getBoundingClientRect().height;
        if (!copyHeight) return;

        // Même hauteur que la boîte texte (exigence visuelle).
        // Largeur = hauteur × ratio image, plafonnée à la colonne.
        // Si le plafond réduit la largeur, de minces bandes peuvent apparaître :
        // le fond CSS (teinte bords image) les absorbe — pas de blanc parasite.
        var targetWidth = copyHeight * ASPECT;
        var hero = document.querySelector(".hero-assemble");
        var availWidth = hero ? hero.getBoundingClientRect().width : targetWidth;
        var colShare = 1.15 / (0.95 + 1.15);
        var maxColWidth = Math.max(0, availWidth * colShare);
        var width = Math.min(targetWidth, maxColWidth);

        scene.style.height = Math.round(copyHeight * 100) / 100 + "px";
        scene.style.width = Math.round(width * 100) / 100 + "px";
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
        scene.classList.add("is-ready", "is-assembled", "is-linked", "is-wireless", "is-alive");
    } else {
        // 1) apparition de la scène / système de référence
        requestAnimationFrame(function () {
            scene.classList.add("is-ready");
        });

        // 2) composition figée
        window.setTimeout(function () {
            scene.classList.add("is-assembled");
        }, 1200);

        // 3) fibres Site / Logiciel → Serveur
        window.setTimeout(function () {
            scene.classList.add("is-linked");
        }, 1600);

        // 4) Wi-Fi App
        window.setTimeout(function () {
            scene.classList.add("is-wireless");
        }, 2600);

        // 5) circulation continue
        window.setTimeout(function () {
            scene.classList.add("is-alive");
        }, 3000);
    }

    fitSceneToCopy();
    window.addEventListener("resize", fitSceneToCopy);
    if (typeof ResizeObserver !== "undefined" && copy) {
        var ro = new ResizeObserver(fitSceneToCopy);
        ro.observe(copy);
    }
    if (typeof mqMobile.addEventListener === "function") {
        mqMobile.addEventListener("change", fitSceneToCopy);
    } else if (typeof mqMobile.addListener === "function") {
        mqMobile.addListener(fitSceneToCopy);
    }
})();
