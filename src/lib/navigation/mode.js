export const MODE_KEY = 'scanlogic_app_mode'
export const RETURN_TAB_KEY = 'scanlogic_return_tab'

export function getShareToken() {
  return new URLSearchParams(window.location.search).get('share')
}

export function getAppMode() {
  if (getShareToken()) return 'scanvault'
  return sessionStorage.getItem(MODE_KEY) || 'suite'
}

export function setAppMode(mode) {
  sessionStorage.setItem(MODE_KEY, mode)
}
