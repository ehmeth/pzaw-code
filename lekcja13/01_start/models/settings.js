"use strict";

const ONE_DAY = 24 * 60 * 60 * 1000;
const THEME_COOKIE = "fisz-theme";
const CONSENT_COOKIE = "fisz-consent";

export function themeToggle(req, res) {
  var theme = req.cookies[THEME_COOKIE];
  if (theme === "dark") {
    theme = "light";
  } else {
    theme = "dark";
  }
  res.cookie(THEME_COOKIE, theme);

  var next = req.query.next || "/";
  res.redirect(next);
}

export function acceptCookies(req, res) {
  res.cookie(CONSENT_COOKIE, true);

  var next = req.query.next || "/";
  res.redirect(next);
}

export function declineCookies(req, res) {
  res.cookie(CONSENT_COOKIE, false);

  var next = req.query.next || "/";
  res.redirect(next);
}

export function manageCookies(req, res) {
  // TODO Handle cookie management
  res.render("cookies_manage", {
    title: "Zarządzanie cookies",
  });
}

export function getSettings(req) {
  const settings = {
    theme: req.cookies[THEME_COOKIE] || "light",
    cookie_consent: req.cookies[CONSENT_COOKIE] || null,
  };
  if (settings.cookie_consent != null) {
    settings.cookie_consent = settings.cookie_consent === "true";
  }
  return settings;
}

export default {
  themeToggle,
  acceptCookies,
  declineCookies,
  manageCookies,
  getSettings,
};
