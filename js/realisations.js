(function () {
    var data = window.AFM_REALISATIONS;
    if (!data) return;

    var liste = document.getElementById("real-grille");
    var detail = document.getElementById("real-detail");
    var detailInner = document.getElementById("real-detail-inner");
    if (!liste || !detail || !detailInner) return;

    function esc(s) {
        return String(s || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    /** Carrousel de photos — toutes les <img> restent dans le HTML (src + alt). */
    function renderCarrousel(images, alts, key, fallbackAlt) {
        images = images || [];
        if (!images.length) return "";
        alts = alts || [];

        var slides = images.map(function (src, i) {
            var alt = alts[i] || fallbackAlt || "";
            return (
                '<figure class="real-carrousel__slide">' +
                '<button type="button" class="real-carrousel__zoom" data-lightbox-src="' + esc(src) + '" data-lightbox-alt="' + esc(alt) + '" aria-label="Agrandir : ' + esc(alt) + '">' +
                '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="' + (i === 0 ? "eager" : "lazy") + '" decoding="async">' +
                "</button>" +
                "</figure>"
            );
        }).join("");

        var nav = "";
        if (images.length > 1) {
            nav =
                '<div class="real-carrousel__nav">' +
                '<button type="button" class="real-carrousel__btn" data-carrousel-prev="' + esc(key) + '" aria-label="Photo précédente">‹</button>' +
                '<span class="real-carrousel__compteur" data-carrousel-count="' + esc(key) + '" aria-live="polite">1 / ' + images.length + "</span>" +
                '<button type="button" class="real-carrousel__btn" data-carrousel-next="' + esc(key) + '" aria-label="Photo suivante">›</button>' +
                "</div>";
        }

        return (
            '<div class="real-carrousel" data-carrousel="' + esc(key) + '" data-index="0" data-count="' + images.length + '">' +
            '<div class="real-carrousel__viewport">' +
            '<div class="real-carrousel__track">' + slides + "</div>" +
            "</div>" +
            nav +
            "</div>"
        );
    }

    function premierePage(projet) {
        return (projet.pages && projet.pages[0]) || {};
    }

    function imagesApercu(projet) {
        if (projet.modeAccordeon && projet.cover) {
            return { images: [projet.cover], alts: [projet.coverAlt || projet.titre] };
        }
        var page = premierePage(projet);
        if (page.images && page.images.length) {
            return { images: page.images, alts: page.imageAlts || [] };
        }
        if (projet.cover) {
            return { images: [projet.cover], alts: [projet.coverAlt || projet.titre] };
        }
        return { images: [], alts: [] };
    }

    function sectionAlternance(page, index) {
        if (page.layout === "a") return "image-gauche";
        if (page.layout === "b") return "texte-gauche";
        return index % 2 === 0 ? "texte-gauche" : "image-gauche";
    }

    function renderSection(page, keyPrefix, index) {
        var alt = sectionAlternance(page, index);
        var points = (page.points || []).map(function (pt) {
            return "<li>" + esc(pt) + "</li>";
        }).join("");
        var texte =
            "<h3>" + esc(page.titre) + "</h3>" +
            (page.desc ? "<p>" + esc(page.desc) + "</p>" : "") +
            (points ? "<ul>" + points + "</ul>" : "");
        var hasMedia = page.images && page.images.length;

        if (!hasMedia) {
            return '<section class="real-section real-section--texte-seul"><div class="real-section__texte">' + texte + "</div></section>";
        }

        return (
            '<section class="real-section real-section--' + alt + '">' +
            '<div class="real-section__texte">' + texte + "</div>" +
            '<div class="real-section__media">' +
            renderCarrousel(page.images, page.imageAlts, keyPrefix + "-" + index, page.titre) +
            "</div>" +
            "</section>"
        );
    }

    function renderAccordeonBody(projet) {
        var sections = (projet.pages || []).map(function (page, i) {
            return renderSection(page, "acc-" + projet.id, i);
        }).join("");

        var circuit = "";
        if (projet.circuit && projet.circuit.src) {
            circuit =
                '<figure class="real-accordeon__circuit">' +
                '<img src="' + esc(projet.circuit.src) + '" alt="' + esc(projet.circuit.alt || "") + '" loading="lazy" decoding="async">' +
                (projet.circuit.caption
                    ? '<figcaption>' + esc(projet.circuit.caption) + "</figcaption>"
                    : "") +
                "</figure>";
        }

        return sections + circuit;
    }

    function texteListe(projet) {
        var desc = "";
        var pointsHtml = "";

        if (projet.modeAccordeon) {
            desc = projet.intro || projet.resume || "";
        } else {
            var page = premierePage(projet);
            desc = page.desc || projet.intro || "";
            if (!desc && projet.resume) {
                var normalize = function (s) {
                    return String(s || "").replace(/[.。]\s*$/, "").trim().toLowerCase();
                };
                if (normalize(projet.resume) !== normalize(projet.sousTitre)) {
                    desc = projet.resume;
                }
            }
            var points = page.points || [];
            pointsHtml = points.length
                ? "<ul class=\"real-bandeau__points\">" + points.map(function (pt) {
                    return "<li>" + esc(pt) + "</li>";
                }).join("") + "</ul>"
                : "";
        }

        var actions;
        if (projet.modeAccordeon) {
            var panelId = "accordeon-" + projet.id;
            actions =
                '<div class="real-bandeau__actions">' +
                '<button type="button" class="btn btn-primary" ' +
                'data-accordeon-toggle="' + esc(projet.id) + '" ' +
                'aria-expanded="false" aria-controls="' + panelId + '" id="btn-' + panelId + '">' +
                esc(projet.boutonOuvrir || "Découvrir") +
                "</button>" +
                "</div>";
        } else {
            actions =
                '<div class="real-bandeau__actions">' +
                '<button type="button" class="btn btn-primary" data-projet="' + esc(projet.id) + '">' +
                esc(projet.boutonFiche || "Voir les détails") +
                "</button>" +
                (projet.url
                    ? '<a class="btn btn-ghost" href="' + esc(projet.url) + '" target="_blank" rel="noopener noreferrer">' +
                      esc(projet.lienLabel || "Lien externe") + "</a>"
                    : "") +
                "</div>";
        }

        return (
            (projet.categorie ? '<span class="real-bandeau__cat">' + esc(projet.categorie) + "</span>" : "") +
            '<h2 class="real-bandeau__titre" id="titre-' + esc(projet.id) + '">' + esc(projet.titre) + "</h2>" +
            (projet.sousTitre ? '<p class="real-bandeau__sous">' + esc(projet.sousTitre) + "</p>" : "") +
            (desc ? '<p class="real-bandeau__desc">' + esc(desc) + "</p>" : "") +
            pointsHtml +
            actions
        );
    }

    function syncCarrousel(root) {
        var count = parseInt(root.getAttribute("data-count"), 10) || 1;
        var index = parseInt(root.getAttribute("data-index"), 10) || 0;
        var track = root.querySelector(".real-carrousel__track");
        if (track) track.style.transform = "translateX(-" + index * 100 + "%)";
        var prev = root.querySelector("[data-carrousel-prev]");
        var next = root.querySelector("[data-carrousel-next]");
        if (prev) prev.disabled = index <= 0;
        if (next) next.disabled = index >= count - 1;
        var compteur = root.querySelector("[data-carrousel-count]");
        if (compteur) compteur.textContent = (index + 1) + " / " + count;
    }

    function moveCarrousel(root, delta) {
        var count = parseInt(root.getAttribute("data-count"), 10) || 1;
        var index = parseInt(root.getAttribute("data-index"), 10) || 0;
        index = Math.max(0, Math.min(count - 1, index + delta));
        root.setAttribute("data-index", String(index));
        syncCarrousel(root);
    }

    function initCarrousels(scope) {
        scope.querySelectorAll(".real-carrousel").forEach(function (root) {
            syncCarrousel(root);
        });
    }

    function renderListe() {
        liste.innerHTML = data.list().map(function (projet, index) {
            var alt = index % 2 === 0 ? "texte-gauche" : "image-gauche";
            var media = imagesApercu(projet);
            var panel = "";
            if (projet.modeAccordeon) {
                var panelId = "accordeon-" + projet.id;
                panel =
                    '<div class="real-accordeon" id="' + panelId + '" role="region" ' +
                    'aria-labelledby="titre-' + esc(projet.id) + '" hidden>' +
                    '<div class="real-accordeon__inner">' +
                    renderAccordeonBody(projet) +
                    "</div>" +
                    "</div>";
            }
            return (
                '<article class="real-bandeau real-bandeau--' + alt + (projet.modeAccordeon ? " real-bandeau--accordeon" : "") + '" id="apercu-' + esc(projet.id) + '">' +
                '<div class="real-bandeau__haut">' +
                '<div class="real-bandeau__texte">' + texteListe(projet) + "</div>" +
                '<div class="real-bandeau__media">' +
                renderCarrousel(media.images, media.alts, "liste-" + projet.id, projet.titre) +
                "</div>" +
                "</div>" +
                panel +
                "</article>"
            );
        }).join("");
        initCarrousels(liste);
    }

    function setAccordeon(id, open) {
        var projet = data.get(id);
        if (!projet || !projet.modeAccordeon) return;
        var panel = document.getElementById("accordeon-" + id);
        var btn = document.querySelector('[data-accordeon-toggle="' + id + '"]');
        var article = document.getElementById("apercu-" + id);
        if (!panel || !btn) return;

        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.textContent = open
            ? (projet.boutonFermer || "Réduire")
            : (projet.boutonOuvrir || "Découvrir");

        if (open) {
            panel.hidden = false;
            article.classList.add("is-accordeon-ouvert");
            if (history.replaceState) {
                history.replaceState(null, "", "#projet-" + id);
            }
            window.requestAnimationFrame(function () {
                article.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        } else {
            panel.hidden = true;
            article.classList.remove("is-accordeon-ouvert");
            if (history.replaceState) {
                history.replaceState(null, "", location.pathname + location.search);
            }
        }
    }

    function toggleAccordeon(id) {
        var btn = document.querySelector('[data-accordeon-toggle="' + id + '"]');
        if (!btn) return;
        var open = btn.getAttribute("aria-expanded") !== "true";
        setAccordeon(id, open);
    }

    function renderDetail(projet) {
        var sections = (projet.pages || []).map(function (page, i) {
            return renderSection(page, projet.id, i);
        }).join("");

        var lienExterne = projet.url
            ? '<a class="btn btn-primary" href="' + esc(projet.url) + '" target="_blank" rel="noopener noreferrer">' +
              esc(projet.lienLabel || "Lien du projet") +
              "</a>"
            : "";

        detailInner.innerHTML =
            '<div class="real-detail__shell">' +
            '<div class="real-detail__toolbar">' +
            '<button type="button" class="real-detail__retour" data-retour>← Retour aux réalisations</button>' +
            (projet.categorie ? '<span class="real-detail__cat">' + esc(projet.categorie) + "</span>" : "") +
            "</div>" +
            '<h2 class="real-detail__titre" id="real-detail-titre">' + esc(projet.titre) + "</h2>" +
            (projet.sousTitre ? '<p class="real-detail__sous">' + esc(projet.sousTitre) + "</p>" : "") +
            (projet.intro ? '<p class="real-detail__intro">' + esc(projet.intro) + "</p>" : "") +
            sections +
            '<div class="real-detail__actions">' + lienExterne +
            '<button type="button" class="btn btn-ghost" data-retour>Retour</button>' +
            "</div>" +
            "</div>";

        initCarrousels(detailInner);
    }

    function ensureLightbox() {
        var box = document.getElementById("real-lightbox");
        if (box) return box;
        box = document.createElement("div");
        box.id = "real-lightbox";
        box.className = "real-lightbox";
        box.setAttribute("hidden", "");
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-label", "Image agrandie");
        box.innerHTML =
            '<button type="button" class="real-lightbox__close" data-lightbox-close aria-label="Fermer">×</button>' +
            '<figure class="real-lightbox__figure"><img src="" alt=""></figure>';
        document.body.appendChild(box);
        box.addEventListener("click", function (e) {
            if (e.target === box || e.target.closest("[data-lightbox-close]")) {
                fermerLightbox();
            }
        });
        return box;
    }

    function ouvrirLightbox(src, alt) {
        var box = ensureLightbox();
        var img = box.querySelector("img");
        img.src = src;
        img.alt = alt || "";
        box.removeAttribute("hidden");
        document.body.classList.add("is-lightbox");
        var closeBtn = box.querySelector("[data-lightbox-close]");
        if (closeBtn) closeBtn.focus();
    }

    function fermerLightbox() {
        var box = document.getElementById("real-lightbox");
        if (!box) return;
        box.setAttribute("hidden", "");
        var img = box.querySelector("img");
        if (img) {
            img.removeAttribute("src");
            img.alt = "";
        }
        document.body.classList.remove("is-lightbox");
    }

    function onCarrouselNav(e) {
        var prev = e.target.closest("[data-carrousel-prev]");
        var next = e.target.closest("[data-carrousel-next]");
        if (!prev && !next) return false;
        var key = (prev || next).getAttribute(prev ? "data-carrousel-prev" : "data-carrousel-next");
        var root = e.currentTarget.querySelector('[data-carrousel="' + key + '"]');
        if (root) moveCarrousel(root, prev ? -1 : 1);
        return true;
    }

    function ouvrir(id) {
        var projet = data.get(id);
        if (!projet) return;
        if (projet.modeAccordeon) {
            setAccordeon(id, true);
            return;
        }
        renderDetail(projet);
        detail.classList.add("is-open");
        document.body.classList.add("is-detail");
        detail.setAttribute("aria-hidden", "false");
        if (history.replaceState) {
            history.replaceState(null, "", "#projet-" + id);
        } else {
            location.hash = "projet-" + id;
        }
        window.requestAnimationFrame(function () {
            detail.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        var retour = detail.querySelector("[data-retour]");
        if (retour) retour.focus();
    }

    function fermer() {
        detail.classList.remove("is-open");
        document.body.classList.remove("is-detail");
        detail.setAttribute("aria-hidden", "true");
        detailInner.innerHTML = "";
        if (history.replaceState) {
            history.replaceState(null, "", location.pathname + location.search);
        } else if (location.hash.indexOf("projet-") === 0) {
            location.hash = "";
        }
        liste.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    liste.addEventListener("click", function (e) {
        var zoom = e.target.closest("[data-lightbox-src]");
        if (zoom) {
            e.preventDefault();
            ouvrirLightbox(zoom.getAttribute("data-lightbox-src"), zoom.getAttribute("data-lightbox-alt"));
            return;
        }
        if (onCarrouselNav(e)) return;

        var acc = e.target.closest("[data-accordeon-toggle]");
        if (acc) {
            e.preventDefault();
            toggleAccordeon(acc.getAttribute("data-accordeon-toggle"));
            return;
        }

        var btn = e.target.closest("[data-projet]");
        if (!btn) return;
        e.preventDefault();
        ouvrir(btn.getAttribute("data-projet"));
    });

    detail.addEventListener("click", function (e) {
        if (e.target.closest("[data-retour]")) {
            fermer();
            return;
        }
        var zoom = e.target.closest("[data-lightbox-src]");
        if (zoom) {
            e.preventDefault();
            ouvrirLightbox(zoom.getAttribute("data-lightbox-src"), zoom.getAttribute("data-lightbox-alt"));
            return;
        }
        onCarrouselNav(e);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (document.body.classList.contains("is-lightbox")) {
            fermerLightbox();
            return;
        }
        if (detail.classList.contains("is-open")) {
            fermer();
            return;
        }
        var openBtn = liste.querySelector('[data-accordeon-toggle][aria-expanded="true"]');
        if (openBtn) {
            setAccordeon(openBtn.getAttribute("data-accordeon-toggle"), false);
            openBtn.focus();
        }
    });

    liste.setAttribute("aria-label", "Liste des réalisations");
    renderListe();

    var hash = location.hash || "";
    var m = hash.match(/^#projet-([a-z0-9-]+)$/i);
    if (m && data.get(m[1])) {
        ouvrir(m[1]);
    }
})();
