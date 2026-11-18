(function () {
    var steps = ["stepNeeds", "stepProject", "stepExpectations", "stepContact"];
    var stepIndex = {
        stepNeeds: 1,
        stepProject: 2,
        stepExpectations: 3,
        stepContact: 4
    };

    var BUDGET_LABELS = {
        "moins-500": "Moins de 500 $",
        "500-1499": "500 $ à 1 499 $",
        "1500-2999": "1 500 $ à 2 999 $",
        "3000-4999": "3 000 $ à 4 999 $",
        "5000-9999": "5 000 $ à 9 999 $",
        "10000-plus": "10 000 $ et plus",
        inconnu: "Je ne sais pas encore"
    };

    var TIMELINE_LABELS = {
        "1-2-semaines": "1 à 2 semaines",
        "2-4-semaines": "2 à 4 semaines",
        "1-2-mois": "1 à 2 mois",
        "2-3-mois": "2 à 3 mois",
        "plus-3-mois": "Plus de 3 mois",
        "aucune-echeance": "Aucune échéance précise"
    };

    var formError = document.getElementById("formError");
    var submitting = false;
    var turnstileWidgetId = null;

    function getConfig() {
        return window.ARTISAN_SOUMISSION_CONFIG || {};
    }

    function isSendConfigured() {
        var cfg = getConfig();
        if (!cfg.enabled) return false;
        if (cfg.provider === "preview") return true;
        if (cfg.provider === "web3forms") {
            return !!cfg.web3formsAccessKey;
        }
        if (cfg.provider === "worker") {
            return !!(cfg.workerUrl && cfg.turnstileSiteKey);
        }
        return false;
    }

    function field(id) {
        return document.getElementById(id);
    }

    function value(id) {
        var checked = document.querySelector('input[name="' + id + '"]:checked');
        if (checked) return String(checked.value || "").trim();
        var el = field(id);
        if (!el) return "";
        if (el.tagName === "DIV" || el.tagName === "FIELDSET") return "";
        return String(el.value || "").trim();
    }

    function setError(id, message) {
        var el = field(id);
        var error = field(id + "Error");
        if (el) el.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) error.textContent = message || "";
        return !message;
    }

    function emailOk(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function phoneDigits(phone) {
        return String(phone || "").replace(/\D/g, "");
    }

    function formatPhoneDisplay(phone) {
        var digits = phoneDigits(phone);
        if (!digits) return "";
        if (digits.length === 11 && digits.charAt(0) === "1") {
            digits = digits.slice(1);
        }
        if (digits.length === 10) {
            return digits.slice(0, 3) + " " + digits.slice(3, 6) + "-" + digits.slice(6);
        }
        return String(phone || "").trim();
    }

    function phoneOk(phone) {
        var digits = phoneDigits(phone);
        if (!digits) return true;
        if (digits.length === 10) return true;
        return digits.length === 11 && digits.charAt(0) === "1";
    }

    function phoneComplete(phone) {
        var digits = phoneDigits(phone);
        if (digits.length === 10) return true;
        return digits.length === 11 && digits.charAt(0) === "1";
    }

    function posteOk(poste) {
        var digits = phoneDigits(poste);
        if (!digits) return true;
        return digits.length >= 1 && digits.length <= 8 && digits === String(poste || "").trim();
    }

    function markFieldState(fieldId, incomplete) {
        var wrap = field("field-" + fieldId);
        if (!wrap) return;
        wrap.classList.toggle("is-incomplete", !!incomplete);
        wrap.classList.toggle("is-complete", !incomplete && value(fieldId) !== "");
    }

    function refreshContactStars() {
        var name = value("clientName");
        var email = value("clientEmail");
        var phone = value("clientPhone");
        var poste = value("clientPoste");

        markFieldState("clientName", !name);
        markFieldState("clientEmail", !email || !emailOk(email));
        markFieldState(
            "clientPhone",
            phoneDigits(phone).length > 0 && !phoneComplete(phone)
        );
        markFieldState(
            "clientPoste",
            phoneDigits(poste).length > 0 && !posteOk(poste)
        );
    }

    function bindCounter(id, max) {
        var el = field(id);
        var counter = field(id + "Counter");
        if (!el || !counter) return;
        var update = function () {
            counter.textContent = el.value.length + " / " + max;
        };
        el.addEventListener("input", update);
        update();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function updateProgress(activeId) {
        var current = stepIndex[activeId] || 1;
        document.querySelectorAll(".soumission-progress__item").forEach(function (item) {
            var n = Number(item.getAttribute("data-step"));
            item.classList.toggle("is-current", n === current);
            item.classList.toggle("is-done", n < current);
        });
    }

    function showStep(id) {
        steps.forEach(function (stepId) {
            var panel = field(stepId);
            if (panel) panel.hidden = panel.id !== id;
        });
        updateProgress(id);
        if (id === "stepContact") buildReview();
        var panel = field(id);
        if (panel) {
            var heading = panel.querySelector("h1, h2");
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                try {
                    heading.focus();
                } catch (e) {
                    /* ignore */
                }
            }
        }
        window.scrollTo(0, 0);
    }

    function selectedCategories() {
        return Array.prototype.slice.call(
            document.querySelectorAll('input[name="categories"]:checked')
        );
    }

    function clearSubOptions(category) {
        document.querySelectorAll('input[name="sub-' + category + '"]').forEach(function (input) {
            input.checked = false;
        });
    }

    function syncCategorySubs() {
        document.querySelectorAll(".category-block").forEach(function (block) {
            var cat = block.getAttribute("data-category");
            var checkbox = block.querySelector('input[name="categories"]');
            var subs = field("subs-" + cat);
            if (!checkbox) return;
            if (subs) {
                if (checkbox.checked) {
                    subs.hidden = false;
                } else {
                    subs.hidden = true;
                    clearSubOptions(cat);
                }
            }
        });
        updateSelectionSummary();
    }

    function gatherSelections() {
        var items = [];
        selectedCategories().forEach(function (catInput) {
            var label = catInput.getAttribute("data-label") || catInput.value;
            var hasSubs = catInput.getAttribute("data-has-subs") === "true";
            if (!hasSubs) {
                items.push({ category: label, details: [] });
                return;
            }
            var subs = Array.prototype.slice
                .call(document.querySelectorAll('input[name="sub-' + catInput.value + '"]:checked'))
                .map(function (el) {
                    return el.getAttribute("data-label") || el.value;
                });
            items.push({ category: label, details: subs });
        });
        return items;
    }

    function updateSelectionSummary() {
        var box = field("selectionSummary");
        if (!box) return;
        var items = gatherSelections();
        if (!items.length) {
            box.hidden = true;
            box.innerHTML = "";
            return;
        }
        var html = "<strong>Sélection actuelle</strong><ul>";
        items.forEach(function (item) {
            if (item.details.length) {
                html +=
                    "<li>" +
                    escapeHtml(item.category) +
                    " — " +
                    escapeHtml(item.details.join(", ")) +
                    "</li>";
            } else {
                html += "<li>" + escapeHtml(item.category) + "</li>";
            }
        });
        html += "</ul>";
        box.innerHTML = html;
        box.hidden = false;
    }

    function validateCategories() {
        var cats = selectedCategories();
        if (!cats.length) {
            setError("categories", "Sélectionnez au moins un type de projet.");
            return false;
        }
        var maintenance = cats.some(function (input) {
            return input.value === "maintenance";
        });
        if (maintenance) {
            var maintSubs = document.querySelectorAll(
                'input[name="sub-maintenance"]:checked'
            );
            if (!maintSubs.length) {
                setError(
                    "categories",
                    "Pour la maintenance, cochez au moins une des deux options."
                );
                return false;
            }
        }
        setError("categories", "");
        return true;
    }

    function syncMaintenanceExterneNote() {
        var note = field("maintenance-externe-note");
        var externe = document.querySelector(
            'input[name="sub-maintenance"][value="externe"]'
        );
        if (!note) return;
        note.hidden = !(externe && externe.checked);
    }

    function buildReview() {
        var stack = field("reviewStack");
        if (!stack) return;

        var selections = gatherSelections();
        var budget = value("budgetType");
        var timeline = value("timelineType");

        var html = "";
        html += card("Vos besoins", "<p>" + escapeHtml(value("needDescription")) + "</p>");

        if (selections.length) {
            html +=
                card(
                    "Votre projet",
                    "<ul>" +
                        selections
                            .map(function (item) {
                                if (item.details.length) {
                                    return (
                                        "<li>" +
                                        escapeHtml(item.category) +
                                        " — " +
                                        escapeHtml(item.details.join(", ")) +
                                        "</li>"
                                    );
                                }
                                return "<li>" + escapeHtml(item.category) + "</li>";
                            })
                            .join("") +
                        "</ul>"
                );
        }

        html += card(
            "Fonctionnalités souhaitées",
            "<p>" + escapeHtml(value("featuresDescription")) + "</p>"
        );

        if (budget || timeline) {
            html +=
                card(
                    "Délai et budget",
                    "<dl>" +
                        (timeline
                            ? row("Délai", TIMELINE_LABELS[timeline] || timeline)
                            : "") +
                        (budget ? row("Budget envisagé", BUDGET_LABELS[budget] || budget) : "") +
                        "</dl>"
                );
        }

        stack.innerHTML = html;
    }

    function card(title, body) {
        return (
            '<article class="review-card"><h3>' +
            escapeHtml(title) +
            "</h3>" +
            body +
            "</article>"
        );
    }

    function row(label, val) {
        return (
            "<div><dt>" +
            escapeHtml(label) +
            "</dt><dd>" +
            escapeHtml(val) +
            "</dd></div>"
        );
    }

    /* Collecte structurée pour un futur envoi (conservée en mémoire page uniquement). */
    function collectPayload() {
        return {
            needDescription: value("needDescription"),
            selections: gatherSelections(),
            featuresDescription: value("featuresDescription"),
            timelineType: value("timelineType"),
            budgetType: value("budgetType"),
            clientName: value("clientName"),
            clientEmail: value("clientEmail"),
            clientCompany: value("clientCompany"),
            clientPhone: formatPhoneDisplay(value("clientPhone")),
            clientPoste: value("clientPoste"),
            clientSignal: value("clientSignal")
        };
    }

    function on(id, eventName, handler) {
        var el = field(id);
        if (!el) return;
        el.addEventListener(eventName, handler);
    }

    function clearErrorOnInput(id) {
        on(id, "input", function () {
            if (value(id)) setError(id, "");
        });
    }

    bindCounter("needDescription", 5000);
    bindCounter("featuresDescription", 5000);
    clearErrorOnInput("needDescription");
    clearErrorOnInput("featuresDescription");
    clearErrorOnInput("clientName");
    clearErrorOnInput("clientEmail");
    clearErrorOnInput("clientPhone");
    clearErrorOnInput("clientPoste");

    document.querySelectorAll('input[name="budgetType"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            setError("budgetType", "");
        });
    });

    ["clientName", "clientEmail", "clientPhone", "clientPoste"].forEach(function (id) {
        on(id, "input", refreshContactStars);
        on(id, "blur", refreshContactStars);
    });

    on("clientPoste", "input", function () {
        var el = field("clientPoste");
        if (!el) return;
        var cleaned = phoneDigits(el.value).slice(0, 8);
        if (el.value !== cleaned) el.value = cleaned;
        refreshContactStars();
    });

    syncCategorySubs();
    updateProgress("stepNeeds");
    refreshContactStars();

    var categoryList = field("categoryList");
    if (categoryList) {
        categoryList.addEventListener("change", function (event) {
            var target = event.target;
            if (!target || target.name !== "categories") {
                if (target && String(target.name || "").indexOf("sub-") === 0) {
                    updateSelectionSummary();
                    if (target.name === "sub-maintenance") {
                        syncMaintenanceExterneNote();
                        if (
                            document.querySelectorAll(
                                'input[name="sub-maintenance"]:checked'
                            ).length
                        ) {
                            setError("categories", "");
                        }
                    }
                }
                return;
            }
            syncCategorySubs();
            syncMaintenanceExterneNote();
            if (selectedCategories().length) setError("categories", "");
        });
    }

    on("toStep2", "click", function () {
        var text = value("needDescription");
        if (!text) {
            setError("needDescription", "Écrivez quelques mots sur votre besoin, puis cliquez sur Suivant.");
            var area = field("needDescription");
            if (area) {
                area.focus();
                if (typeof area.scrollIntoView === "function") {
                    area.scrollIntoView({ block: "center" });
                }
            }
            return;
        }
        setError("needDescription", "");
        showStep("stepProject");
    });

    on("backToStep1", "click", function () {
        showStep("stepNeeds");
    });

    on("toStep3", "click", function () {
        if (!validateCategories()) return;
        showStep("stepExpectations");
    });

    on("backToStep2", "click", function () {
        showStep("stepProject");
    });

    on("toStep4", "click", function () {
        var ok = true;
        if (!value("featuresDescription")) {
            setError(
                "featuresDescription",
                "Décrivez les fonctionnalités ou résultats souhaités."
            );
            ok = false;
            var area = field("featuresDescription");
            if (area) area.focus();
        } else {
            setError("featuresDescription", "");
        }
        if (!value("budgetType")) {
            setError("budgetType", "Choisissez une fourchette de budget.");
            ok = false;
            var budgetFirst = document.querySelector(
                'input[name="budgetType"]'
            );
            if (budgetFirst && !value("featuresDescription")) {
                /* focus déjà sur features */
            } else if (budgetFirst) {
                budgetFirst.focus();
            }
        } else {
            setError("budgetType", "");
        }
        if (!ok) return;
        var submitError = field("submitError");
        var submitSuccess = field("submitSuccess");
        if (submitError) submitError.textContent = "";
        if (submitSuccess) {
            submitSuccess.hidden = true;
            var successClear = field("submitSuccessText");
            if (successClear) successClear.textContent = "";
        }
        showStep("stepContact");
    });

    on("backToStep3", "click", function () {
        showStep("stepExpectations");
    });

    function getTurnstileToken() {
        var cfg = getConfig();
        if (!cfg.turnstileSiteKey || typeof window.turnstile === "undefined") {
            return "";
        }
        try {
            if (turnstileWidgetId !== null) {
                return window.turnstile.getResponse(turnstileWidgetId) || "";
            }
            return window.turnstile.getResponse() || "";
        } catch (e) {
            return "";
        }
    }

    function resetTurnstile() {
        try {
            if (typeof window.turnstile !== "undefined" && turnstileWidgetId !== null) {
                window.turnstile.reset(turnstileWidgetId);
            }
        } catch (e) {
            /* ignore */
        }
    }

    function loadTurnstile() {
        var cfg = getConfig();
        var hint = field("turnstileHint");
        var host = field("turnstileWidget");

        /* Preview / Web3Forms : pas de Turnstile */
        if (cfg.provider === "preview" || cfg.provider === "web3forms") {
            if (hint) {
                if (cfg.provider === "preview") {
                    hint.hidden = false;
                    hint.textContent =
                        "Mode aperçu : le courriel HTML s’ouvre dans un onglet. Aucun Outlook. Envoi réel = Web3Forms (clé à brancher).";
                } else {
                    hint.hidden = true;
                }
            }
            if (host) host.innerHTML = "";
            return;
        }

        if (!isSendConfigured() || cfg.provider !== "worker") {
            if (hint) {
                hint.hidden = false;
                hint.textContent =
                    "L’envoi Worker/Turnstile est en pause (Cloudflare). Voie actuelle : Web3Forms.";
            }
            return;
        }
        if (hint) hint.hidden = true;
        if (!host) return;

        host.setAttribute("data-sitekey", cfg.turnstileSiteKey);

        if (typeof window.turnstile !== "undefined") {
            try {
                turnstileWidgetId = window.turnstile.render(host, {
                    sitekey: cfg.turnstileSiteKey,
                    theme: "light"
                });
            } catch (e) {
                /* déjà rendu */
            }
            return;
        }

        var script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.onload = function () {
            try {
                turnstileWidgetId = window.turnstile.render(host, {
                    sitekey: cfg.turnstileSiteKey,
                    theme: "light"
                });
            } catch (e) {
                /* ignore */
            }
        };
        document.head.appendChild(script);
    }

    function sendViaWorker(data) {
        var cfg = getConfig();
        var payload = {
            needDescription: data.needDescription,
            selections: data.selections,
            featuresDescription: data.featuresDescription,
            timelineType: data.timelineType,
            budgetType: data.budgetType,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientCompany: data.clientCompany,
            clientPhone: data.clientPhone,
            clientPoste: data.clientPoste,
            clientSignal: data.clientSignal,
            turnstileToken: getTurnstileToken(),
            website: value("website")
        };

        return fetch(cfg.workerUrl.replace(/\/$/, "") + "/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(function (res) {
            return res.json().then(function (json) {
                return { status: res.status, json: json || {} };
            });
        });
    }

    function sendViaWeb3Forms(data) {
        var cfg = getConfig();
        var mail = window.ArtisanSoumissionMail;
        var text = mail ? mail.buildText(data) : "";
        var phoneDigits = String(data.clientPhone || "").replace(/\D/g, "");
        if (phoneDigits.length === 10) phoneDigits = "1" + phoneDigits;
        var phoneIntl = "";
        if (phoneDigits.length === 11 && phoneDigits.charAt(0) === "1") {
            phoneIntl =
                "+1 " +
                phoneDigits.slice(1, 4) +
                "-" +
                phoneDigits.slice(4, 7) +
                "-" +
                phoneDigits.slice(7);
        }
        var signalRaw = String(data.clientSignal || "").trim();
        var signalUrl = signalRaw
            ? "https://signal.me/#u/" + encodeURIComponent(signalRaw.replace(/^@/, ""))
            : "";

        /* Web3Forms = texte seulement (pas de vrais <a href>).
           Champs séparés + valeurs « nues » pour que Gmail mobile les lie. */
        var payload = {
            access_key: cfg.web3formsAccessKey,
            subject: "Demande de projet — " + data.clientName,
            from_name: "Artisan FM",
            name: data.clientName,
            email: data.clientEmail,
            replyto: data.clientEmail,
            message: text,
            Telephone: phoneIntl || data.clientPhone || "—",
            botcheck: value("website")
        };
        if (signalUrl) {
            payload.Signal = signalUrl;
        }

        return fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }).then(function (res) {
            return res.json().then(function (json) {
                return { status: res.status, json: json || {} };
            });
        });
    }

    function sendViaPreview(data) {
        var mail = window.ArtisanSoumissionMail;
        var html = mail ? mail.buildHtml(data) : "<p>Aperçu indisponible</p>";

        /* Aperçu HTML seulement — aucun mailto, aucun Outlook */
        try {
            var blob = new Blob([html], { type: "text/html;charset=utf-8" });
            var url = URL.createObjectURL(blob);
            var win = window.open(url, "_blank");
            if (!win) {
                return Promise.resolve({
                    status: 200,
                    json: {
                        ok: false,
                        error:
                            "Le navigateur a bloqué l’aperçu. Autorise les fenêtres pop-up, ou ouvre soumission/apercu-courriel.html"
                    }
                });
            }
            window.setTimeout(function () {
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {
                    /* ignore */
                }
            }, 120000);
        } catch (e) {
            return Promise.resolve({
                status: 500,
                json: { ok: false, error: "Impossible d’ouvrir l’aperçu HTML." }
            });
        }

        return Promise.resolve({ status: 200, json: { ok: true, preview: true } });
    }

    function sendRequest(data) {
        var cfg = getConfig();
        if (cfg.provider === "preview") return sendViaPreview(data);
        if (cfg.provider === "web3forms") return sendViaWeb3Forms(data);
        return sendViaWorker(data);
    }

    function resultIsOk(result) {
        var j = result.json || {};
        if (j.ok === true || j.success === true) return true;
        if (String(j.message || "").toLowerCase().indexOf("success") !== -1) return true;
        return false;
    }

    on("submitBtn", "click", function () {
        if (submitting) return;

        var ok = true;
        ok = setError("clientName", value("clientName") ? "" : "Indiquez votre nom.") && ok;
        ok =
            setError(
                "clientEmail",
                emailOk(value("clientEmail")) ? "" : "Indiquez un courriel valide."
            ) && ok;
        ok =
            setError(
                "clientPhone",
                phoneOk(value("clientPhone"))
                    ? ""
                    : "Numéro incomplet : 10 chiffres, ou 11 avec l’indicatif 1."
            ) && ok;
        ok =
            setError(
                "clientPoste",
                posteOk(value("clientPoste"))
                    ? ""
                    : "Le poste doit contenir uniquement des chiffres (max. 8)."
            ) && ok;
        refreshContactStars();
        if (!ok) return;

        var btn = field("submitBtn");
        var err = field("submitError");
        var success = field("submitSuccess");
        var successText = field("submitSuccessText");
        if (err) err.textContent = "";
        if (success) {
            success.hidden = true;
            if (successText) successText.textContent = "";
        }
        if (formError) formError.textContent = "";

        if (!isSendConfigured()) {
            if (err) {
                err.textContent =
                    "L’envoi n’est pas configuré. Vos renseignements restent sur cette page.";
            }
            return;
        }

        var cfg = getConfig();
        if (cfg.provider === "worker" && !getTurnstileToken()) {
            if (err) {
                err.textContent = "Complétez la vérification anti-robot, puis réessayez.";
            }
            return;
        }

        var data = collectPayload();

        submitting = true;
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Envoi en cours…";
        }

        sendRequest(data)
            .then(function (result) {
                if (resultIsOk(result)) {
                    if (success) {
                        success.hidden = false;
                        if (successText) {
                            if (cfg.provider === "preview") {
                                successText.textContent =
                                    "Aperçu HTML ouvert (pas d’envoi, pas d’Outlook). L’envoi réel demandera une clé Web3Forms.";
                            } else {
                                successText.innerHTML =
                                    '<strong class="submit-success__lead">Votre demande a été transmise avec succès.</strong>' +
                                    '<span class="submit-success__body">Merci de votre confiance envers Artisan FM. Je prendrai connaissance de votre projet et vous répondrai dans un délai de 1 à 2 jours ouvrables.</span>';
                            }
                        }
                    }
                    resetTurnstile();
                    return;
                }
                if (err) {
                    err.textContent =
                        (result.json && (result.json.error || result.json.message)) ||
                        "L’envoi a échoué. Vos renseignements sont conservés — réessayez.";
                }
                resetTurnstile();
            })
            .catch(function () {
                if (err) {
                    err.textContent =
                        "Impossible de joindre le serveur d’envoi. Vérifiez votre connexion, puis réessayez. Vos renseignements sont conservés.";
                }
                resetTurnstile();
            })
            .then(function () {
                submitting = false;
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = "Envoyer ma demande";
                }
            });
    });

    loadTurnstile();

    /* Exposé pour tests / futur branchement d’envoi */
    window.ArtisanSoumission = {
        collectPayload: collectPayload,
        gatherSelections: gatherSelections,
        isSendConfigured: isSendConfigured
    };
})();
