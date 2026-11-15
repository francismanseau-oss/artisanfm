/* Données des réalisations — extraites du livre (livre.js), sans perte de contenu. */
window.AFM_REALISATIONS = (function () {
    var assetBase = "../assets/realisations/";

    var projets = {
        fourrures: {
            id: "fourrures",
            titre: "Les Fourrures Boréales",
            sousTitre: "Boutique en ligne artisanale",
            categorie: "Site web",
            resume: "Boutique en ligne artisanale.",
            cover: assetBase + "fourrures-mitaines.png",
            coverAlt: "Les Fourrures Boréales — mitaines",
            url: "https://lesfourruresboreales.ca",
            lienLabel: "Voir le projet",
            pages: [
                {
                    titre: "Les Fourrures Boréales",
                    sousTitre: "Boutique en ligne artisanale",
                    desc: "",
                    images: [
                        assetBase + "fourrures-mitaines.png",
                        assetBase + "fourrures-ambiance.png"
                    ],
                    imageAlts: [
                        "Les Fourrures Boréales — mitaines",
                        "Les Fourrures Boréales — ambiance"
                    ],
                    url: "https://lesfourruresboreales.ca"
                }
            ]
        },
        nexus: {
            id: "nexus",
            titre: "Nexus Mobile, PC et WSAI",
            sousTitre: "Écosystème d'agents IA",
            categorie: "Assemblage et interconnexion",
            resume: "Écosystème privé reliant Nexus Mobile, WSAI et Nexus PC pour piloter des agents IA à distance et faire évoluer des projets depuis le téléphone.",
            cover: assetBase + "nexus/nexus-bridge.png",
            coverAlt: "Nexus — vue d'ensemble Mobile, WSAI et PC",
            intro: "Écosystème privé reliant Nexus Mobile, WSAI et Nexus PC : depuis mon cellulaire, je pilote mon agent de développement (Cursor) comme si j’étais devant l’ordinateur, pour faire avancer mes projets de partout.",
            /* Accordéon in-page — aucun lien externe, aucune page séparée */
            modeAccordeon: true,
            boutonOuvrir: "Découvrir Nexus",
            boutonFermer: "Réduire Nexus",
            url: null,
            circuit: {
                src: assetBase + "nexus/ecosysteme-nexus-circuit-complet.jpg",
                alt: "Schéma de l'écosystème Nexus montrant les connexions entre Nexus Mobile, WSAI, Nexus PC, l'IA codeur locale, Git et le Web."
            },
            /* Ordre obligatoire dans l'accordéon : Mobile → PC → WSAI */
            pages: [
                {
                    titre: "Nexus Mobile",
                    layout: "b",
                    desc: "Application Android conçue comme point d'entrée de l'écosystème : écrire les demandes, choisir l'agent et suivre le travail à distance, sans rester devant l'ordinateur.",
                    points: [
                        "Objectif — poursuivre un projet depuis le téléphone, là où je me trouve",
                        "Fonctionnalités — chat mission, choix d'agent (dont le programmeur IA intégré sur le PC), options et préférences",
                        "Fonctionnement — envoi des missions vers WSAI ; suivi du travail à distance",
                        "Rôle dans Nexus — interface mobile de pilotage de l'écosystème",
                        "Interactions vérifiées — dialogue avec WSAI ; réveil du PC via Wake-on-LAN",
                        "Conception et assemblage — application Android intégrée au reste du circuit Nexus"
                    ],
                    carrousel: true,
                    images: [
                        assetBase + "nexus/04-chat-mission.png",
                        assetBase + "nexus/02-agents.jpg",
                        assetBase + "nexus/01-options.png"
                    ],
                    imageAlts: [
                        "Nexus Mobile — chat mission et session avec le programmeur IA",
                        "Nexus Mobile — menu agents",
                        "Nexus Mobile — options et Wake-on-LAN"
                    ]
                },
                {
                    titre: "Nexus PC",
                    layout: "a",
                    desc: "Logiciel Windows permettant de contrôler à distance un agent IA spécialisé en programmation, directement sur mon ordinateur, à partir de mon téléphone.",
                    points: [
                        "Objectif — Piloter et poursuivre des projets de développement à distance.",
                        "Fonctionnalités — Centre de contrôle, communication avec l'IA codeur et maintien du contexte de travail.",
                        "Fonctionnement — Les instructions envoyées depuis le mobile sont transmises à l'IA sur le PC, puis les résultats sont retournés au téléphone.",
                        "Rôle dans Nexus — Centre d'exécution local de l'écosystème.",
                        "Interactions vérifiées — Communication bidirectionnelle entre le mobile et le PC.",
                        "Conception et assemblage — Intégration du poste Windows dans l'écosystème Mobile ↔ WSAI ↔ PC."
                    ],
                    carrousel: true,
                    images: [
                        assetBase + "nexus/nexus-bridge-control-center.png"
                    ],
                    imageAlts: [
                        "Nexus PC — Control Center"
                    ]
                },
                {
                    titre: "WSAI",
                    layout: "b",
                    desc: "Serveur intermédiaire privé qui relie les systèmes, transporte les demandes et permet de communiquer avec les agents. Il se situe entre Nexus Mobile et Nexus PC dans la boucle de travail. La console WSAI sert de tableau de bord en arrière-plan de Nexus.",
                    points: [
                        "Objectif — relayer les demandes et faire communiquer Mobile, PC et agents",
                        "Fonctionnalités — transport des missions, communication avec les agents, console tableau de bord",
                        "Fonctionnement — position centrale entre Nexus Mobile et Nexus PC",
                        "Rôle dans Nexus — serveur IA privé et plaque tournante de l'écosystème",
                        "Interactions vérifiées — relais Mobile ↔ WSAI ↔ Nexus PC",
                        "Conception et assemblage — serveur conçu pour interconnecter les composantes sans les fusionner"
                    ],
                    carrousel: true,
                    images: [
                        assetBase + "nexus/wsai-console-dashboard.png"
                    ],
                    imageAlts: [
                        "WSAI Console — tableau de bord"
                    ]
                }
            ]
        },
        hk: {
            id: "hk",
            titre: "HK Crib GO",
            sousTitre: "Application de jeu",
            categorie: "Application",
            resume: "Hong Kong Cribbage en version rapide : parties hors ligne, adversaires IA, six langues, statistiques, récompenses et support technique intégré.",
            cover: assetBase + "hk/partie-en-cours.png",
            coverAlt: "HK Crib GO — Partie en cours contre l'IA",
            url: "https://github.com/francismanseau-oss/hk-crib-go-apk/releases/download/v2.0.11/HK-Crib-GO-2.0.11.apk",
            lienLabel: "Télécharger l'APK",
            pages: [
                {
                    titre: "HK Crib GO",
                    layout: "a",
                    desc: "HK Crib GO — Hong Kong Cribbage en version rapide : parties en rounds d'environ 5 minutes, cinq adversaires IA, six langues, pointage visuel, statistiques, récompenses et support technique intégré. Le projet est né du besoin de jouer au cribbage Hong Kong dehors sans que les cartes s'envolent.",
                    points: [
                        "Jeu hors ligne, sans connexion",
                        "Cinq adversaires IA et personnalisation (cartes, table, comptage)",
                        "Interface disponible en six langues",
                        "Pointage visible sous les cartes, avec pastilles lorsque une carte compte plusieurs fois",
                        "Historique, médailles et trophées selon les performances",
                        "Centre de soutien relié à WSAI (accusé de réception puis réponse adaptée)"
                    ],
                    carrousel: true,
                    images: [
                        assetBase + "hk/partie-en-cours.png",
                        assetBase + "hk/menu-parametres.png",
                        assetBase + "hk/support-centre.png"
                    ],
                    imageAlts: [
                        "HK Crib GO — Partie en cours contre l'IA",
                        "HK Crib GO — Fin d'un round",
                        "HK Crib GO — Centre de support technique"
                    ]
                }
            ]
        },
        haven: {
            id: "haven",
            titre: "Haven",
            sousTitre: "Refuge numérique Android",
            categorie: "Application",
            resume: "Refuge numérique Android qui réduit les interruptions du téléphone selon le contexte, sans couper des communications importantes. En phase de test sur Google Play.",
            cover: assetBase + "haven/haven.png",
            coverAlt: "Haven — refuge numérique Android",
            url: "https://github.com/francismanseau-oss/haven-apk/releases/latest/download/haven.apk",
            lienLabel: "Télécharger l'APK",
            pages: [
                {
                    titre: "Haven",
                    layout: "b",
                    desc: "Haven est un refuge numérique Android conçu pour réduire les interruptions du téléphone — appels, notifications et autres sollicitations — sans couper l'utilisateur des communications importantes. Ce n'est pas un simple mode « Ne pas déranger » : Haven adapte le comportement du téléphone selon le contexte (travail, conduite, sommeil, école ou repos). En phase de test sur Google Play.",
                    points: [
                        "Modes selon le contexte, avec règles et exceptions configurables",
                        "Mode conduite pouvant s'activer via Android Auto ou Bluetooth du véhicule",
                        "Alertes gouvernementales (ex. AMBER) et accès d'urgence (911) préservés",
                        "Contacts d'urgence et logique du deuxième appel en moins de 5 minutes",
                        "Historique des interruptions évitées et horaire d'automatisation"
                    ],
                    carrousel: true,
                    images: [
                        assetBase + "haven/01-accueil.png",
                        assetBase + "haven/02-historique.png",
                        assetBase + "haven/03-horaire.png",
                        assetBase + "haven/haven.png"
                    ],
                    imageAlts: [
                        "Haven — Accueil : modes Jour, Conduite, Sommeil, Travail",
                        "Haven — Historique : interruptions évitées",
                        "Haven — Horaire automatique hebdomadaire",
                        "Haven — refuge numérique Android"
                    ]
                }
            ]
        }
    };

    var ordre = ["fourrures", "nexus", "hk", "haven"];

    return {
        ordre: ordre,
        projets: projets,
        get: function (id) {
            return projets[id] || null;
        },
        list: function () {
            return ordre.map(function (id) {
                return projets[id];
            });
        }
    };
})();
