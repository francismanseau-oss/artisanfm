/**
 * Config formulaire.
 * - preview : aperçu HTML seulement (pas de mailto, pas d’envoi) — mode actuel
 * - web3forms : envoi réel quand access key fournie
 * - worker : Cloudflare (pause jusqu’à dimanche)
 */
window.ARTISAN_SOUMISSION_CONFIG = {
  provider: "preview",

  toEmail: "contact@artisanfm.ca",

  web3formsAccessKey: "",
  workerUrl: "",
  turnstileSiteKey: "",

  /* true pour preview ; pour web3forms, true seulement avec une access key */
  enabled: true
};
