(function () {
    var scene = document.getElementById("assemble-scene");
    if (!scene) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
        scene.classList.add("is-ready", "is-assembled", "is-linked", "is-wireless", "is-alive");
        return;
    }

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
})();
