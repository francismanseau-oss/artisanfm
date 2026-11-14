/**
 * Modèle de courriel HTML Artisan FM (blanc lumineux / bleu glacial).
 * Compatible Gmail / Outlook (tables + CSS inline).
 */
(function (global) {
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
        "des-que-possible": "Dès que possible",
        semaine: "Cette semaine",
        mois: "Ce mois-ci",
        "trois-mois": "Dans les 3 prochains mois",
        flexible: "Flexible / À discuter",
        "sans-date": "Aucune date précise"
    };

    function escapeHtml(str) {
        return String(str == null ? "" : str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function nl2br(str) {
        return escapeHtml(str).replace(/\r\n|\r|\n/g, "<br>");
    }

    function row(label, valueHtml) {
        return (
            '<tr>' +
            '<td style="padding:0 0 10px 0;width:120px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#3d6a8c;">' +
            escapeHtml(label) +
            "</td>" +
            '<td style="padding:0 0 10px 0;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.45;color:#244b69;">' +
            valueHtml +
            "</td>" +
            "</tr>"
        );
    }

    function section(title, innerHtml) {
        return (
            '<tr><td style="padding:0 24px 16px 24px;">' +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#ffffff;border:1px solid #a8d8f0;border-radius:12px;border-collapse:separate !important;">' +
            "<tr><td style=\"padding:18px 18px 8px 18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#3d8eb8;border-bottom:1px solid #e3f4fc;\">" +
            escapeHtml(title) +
            "</td></tr>" +
            '<tr><td style="padding:16px 18px 18px 18px;">' +
            innerHtml +
            "</td></tr></table></td></tr>"
        );
    }

    function buildHtml(data) {
        data = data || {};
        var phoneLine = data.clientPhone
            ? escapeHtml(data.clientPhone) +
              (data.clientPoste ? " &nbsp;·&nbsp; poste " + escapeHtml(data.clientPoste) : "")
            : data.clientPoste
              ? "Poste " + escapeHtml(data.clientPoste)
              : "—";

        var selections = (data.selections || [])
            .map(function (item) {
                var cat = escapeHtml(item.category || "");
                var details =
                    item.details && item.details.length
                        ? " — " + escapeHtml(item.details.join(", "))
                        : "";
                return (
                    '<li style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#244b69;">' +
                    cat +
                    details +
                    "</li>"
                );
            })
            .join("");

        var timeline = data.timelineType
            ? TIMELINE_LABELS[data.timelineType] || data.timelineType
            : "Non précisé";
        var budget = data.budgetType
            ? BUDGET_LABELS[data.budgetType] || data.budgetType
            : "Non précisé";

        var coords =
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">' +
            row("Nom", escapeHtml(data.clientName || "—")) +
            row("Courriel", escapeHtml(data.clientEmail || "—")) +
            row("Entreprise", escapeHtml(data.clientCompany || "—")) +
            row("Téléphone", phoneLine) +
            "</table>";

        var projetInner = selections
            ? '<ul style="margin:0;padding-left:20px;">' + selections + "</ul>"
            : '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#244b69;">—</p>';

        return (
            '<!DOCTYPE html>' +
            '<html lang="fr">' +
            "<head>" +
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            "<title>Demande Artisan FM</title>" +
            "<!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]-->" +
            "</head>" +
            '<body style="margin:0;padding:0;background-color:#f1faff;">' +
            '<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Nouvelle demande de projet — Artisan FM</div>' +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f1faff;border-collapse:collapse;">' +
            "<tr><td align=\"center\" style=\"padding:28px 12px;\">" +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background-color:#eaf6fc;border:1px solid #8bcff4;border-radius:18px;border-collapse:separate !important;overflow:hidden;">' +
            /* En-tête */
            "<tr><td style=\"padding:28px 24px 20px 24px;background-color:#ffffff;border-bottom:1px solid #d9f0ff;\">" +
            '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#5eb8e8;">Artisan FM</p>' +
            '<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.25;font-weight:700;color:#244b69;">Nouvelle demande de projet</h1>' +
            '<p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#3d6a8c;">Formulaire « Démarrer un projet »</p>' +
            "</td></tr>" +
            /* Espace sous en-tête */
            '<tr><td style="height:20px;line-height:20px;font-size:1px;">&nbsp;</td></tr>' +
            section("Coordonnées", coords) +
            section(
                "Besoins",
                '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#244b69;">' +
                    nl2br(data.needDescription || "—") +
                    "</p>"
            ) +
            section("Projet", projetInner) +
            section(
                "Attentes",
                '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#244b69;">' +
                    nl2br(data.featuresDescription || "—") +
                    "</p>"
            ) +
            section(
                "Délai",
                '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#244b69;">' +
                    escapeHtml(timeline) +
                    "</p>"
            ) +
            section(
                "Budget",
                '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#244b69;">' +
                    escapeHtml(budget) +
                    "</p>" +
                    '<p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#3d6a8c;">Montant indicatif fourni par le client — ce n’est ni une soumission ni une promesse de prix.</p>'
            ) +
            /* Espacement obligatoire ≥ 2 lignes vides après le budget */
            '<tr><td style="padding:8px 24px 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#eaf6fc;">&nbsp;<br>&nbsp;<br>&nbsp;</td></tr>' +
            '<tr><td style="padding:0 24px 32px 24px;">' +
            '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#3d6a8c;">Répondez à ce message pour écrire directement au client.</p>' +
            '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#eaf6fc;">&nbsp;<br>&nbsp;</p>' +
            "</td></tr>" +
            "</table>" +
            "</td></tr></table>" +
            "</body></html>"
        );
    }

    function buildText(data) {
        data = data || {};
        var lines = [];
        lines.push("Nouvelle demande — Artisan FM");
        lines.push("");
        lines.push("— Coordonnées —");
        lines.push("Nom : " + (data.clientName || ""));
        lines.push("Courriel : " + (data.clientEmail || ""));
        lines.push("Entreprise : " + (data.clientCompany || "—"));
        lines.push(
            "Téléphone : " +
                (data.clientPhone || "—") +
                (data.clientPoste ? "  poste " + data.clientPoste : "")
        );
        lines.push("");
        lines.push("— Besoins —");
        lines.push(data.needDescription || "");
        lines.push("");
        lines.push("— Projet —");
        (data.selections || []).forEach(function (item) {
            if (item.details && item.details.length) {
                lines.push("- " + item.category + " : " + item.details.join(", "));
            } else {
                lines.push("- " + (item.category || ""));
            }
        });
        lines.push("");
        lines.push("— Attentes —");
        lines.push(data.featuresDescription || "");
        lines.push("");
        lines.push(
            "— Délai — " +
                (data.timelineType
                    ? TIMELINE_LABELS[data.timelineType] || data.timelineType
                    : "Non précisé")
        );
        lines.push(
            "— Budget — " +
                (data.budgetType
                    ? BUDGET_LABELS[data.budgetType] || data.budgetType
                    : "Non précisé")
        );
        lines.push("");
        lines.push("");
        lines.push("");
        return lines.join("\n");
    }

    global.ArtisanSoumissionMail = {
        buildHtml: buildHtml,
        buildText: buildText,
        BUDGET_LABELS: BUDGET_LABELS,
        TIMELINE_LABELS: TIMELINE_LABELS
    };
})(window);
