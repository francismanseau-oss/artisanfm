/**
 * Config formulaire.
 * - preview : aperçu HTML seulement
 * - web3forms : envoi via Web3Forms (secours)
 * - worker : Cloudflare Worker + Resend (actif)
 */
window.ARTISAN_SOUMISSION_CONFIG = {
  provider: "worker",

  toEmail: "contact@artisanfm.ca",

  web3formsAccessKey: "f81525f5-3811-4386-8e17-4c5d24eff83d",
  workerUrl: "https://artisanfm-soumission-mail.garageweidler.workers.dev",
  turnstileSiteKey: "0x4AAAAAAGFeJ2qWGVsZTyen",

  enabled: true
};
