(function () {
    var steps = Array.prototype.slice.call(document.querySelectorAll(".form-panel"));
    var formError = document.getElementById("formError");

    function showStep(id) {
        steps.forEach(function (panel) {
            panel.hidden = panel.id !== id;
        });
        var panel = document.getElementById(id);
        if (panel) {
            var heading = panel.querySelector("h1, h2");
            if (heading) heading.setAttribute("tabindex", "-1");
            if (heading) heading.focus();
        }
        window.scrollTo(0, 0);
    }

    function field(id) {
        return document.getElementById(id);
    }

    function value(id) {
        var el = field(id);
        return el ? el.value.trim() : "";
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

    function phoneOk(phone) {
        var digits = phone.replace(/\D/g, "");
        if (!digits) return true;
        if (digits.length === 10) return true;
        return digits.length === 11 && digits.charAt(0) === "1";
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

    bindCounter("projectDescription", 5000);
    bindCounter("expectedResult", 1500);

    field("startBtn").addEventListener("click", function () {
        if (!field("consent").checked) {
            setError("consent", "Cochez la case pour continuer.");
            return;
        }
        setError("consent", "");
        showStep("stepNeed");
    });

    field("toDetails").addEventListener("click", function () {
        var ok = true;
        ok = setError("serviceType", value("serviceType") ? "" : "Choisissez la nature du besoin.") && ok;
        ok = setError("platformType", value("platformType") ? "" : "Choisissez le support visé.") && ok;
        if (ok) showStep("stepDetails");
    });

    field("backToWelcome").addEventListener("click", function () {
        showStep("stepWelcome");
    });

    field("toRates").addEventListener("click", function () {
        var ok = true;
        ok = setError("clientName", value("clientName") ? "" : "Indiquez votre nom.") && ok;
        ok = setError("clientEmail", emailOk(value("clientEmail")) ? "" : "Indiquez un courriel valide.") && ok;
        ok = setError("clientPhone", phoneOk(value("clientPhone")) ? "" : "Le téléphone doit avoir 10 chiffres, ou 11 avec l'indicatif 1.") && ok;
        ok = setError("projectDescription", value("projectDescription") ? "" : "Décrivez le besoin.") && ok;
        ok = setError("expectedResult", value("expectedResult") ? "" : "Décrivez le résultat attendu.") && ok;
        ok = setError("budgetType", value("budgetType") ? "" : "Indiquez le budget, même s'il est encore inconnu.") && ok;
        ok = setError("timelineType", value("timelineType") ? "" : "Indiquez le délai souhaité.") && ok;
        if (ok) showStep("stepRates");
    });

    field("backToNeed").addEventListener("click", function () {
        showStep("stepNeed");
    });

    field("finishBtn").addEventListener("click", function () {
        if (!field("ratesConsent").checked) {
            setError("ratesConsent", "Cochez la case pour continuer.");
            return;
        }
        setError("ratesConsent", "");
        if (formError) formError.textContent = "";
        showStep("stepHold");
    });

    field("backToDetails").addEventListener("click", function () {
        showStep("stepDetails");
    });
})();
