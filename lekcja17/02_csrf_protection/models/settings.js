"use strict";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;
const THEME_COOKIE = "__Host-fisz-theme";
const CONSENT_COOKIE = "__Host-fisz-consent";
const CONSENT_PARAMS = { maxAge: ONE_MONTH, secure: true, httpOnly: true };

export function themeToggle(req, res) {
  var theme = req.cookies[THEME_COOKIE];
  if (theme === "dark") {
    theme = "light";
  } else {
    theme = "dark";
  }
  res.cookie(THEME_COOKIE, theme, { maxAge: ONE_MONTH, secure: true });

  var next = req.query.next || "/";
  res.redirect(next);
}

export function acceptCookies(req, res) {
  res.cookie(CONSENT_COOKIE, true, CONSENT_PARAMS);

  var next = req.query.next || "/";
  res.redirect(next);
}

export function declineCookies(req, res) {
  res.cookie(CONSENT_COOKIE, false, CONSENT_PARAMS);

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

function settingsHandler(req, res, next) {
  res.locals.app = getSettings(req);
  res.locals.page = req.path;

  if (res.locals.app.cookie_consent != null) {
    res.cookie(CONSENT_COOKIE, res.locals.app.cookie_consent, CONSENT_PARAMS);
  }
  next();
}

export default {
  themeToggle,
  acceptCookies,
  declineCookies,
  manageCookies,
  getSettings,
  settingsHandler,
};
