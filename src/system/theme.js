// system/theme.js

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
}

export const DEFAULT_THEME = THEMES.DARK

export function loadTheme() {
  return localStorage.getItem('jacOS-theme') ?? DEFAULT_THEME
}

export function saveTheme(theme) {
  localStorage.setItem('jacOS-theme', theme)
}