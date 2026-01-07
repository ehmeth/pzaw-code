"use strict";

const ONE_DAY = 24 * 60 * 60 * 1000;
const THEME_COOKIE = "fisz-theme";

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

export function getSettings(req) {
  const settings = {
    theme: req.cookies[THEME_COOKIE] || "light",
  };
  return settings;
}

export default {
  themeToggle,
  getSettings,
};
