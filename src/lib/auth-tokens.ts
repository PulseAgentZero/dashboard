const ACCESS_KEY = "pulse_access_token";
const REFRESH_KEY = "pulse_refresh_token";

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export const tokens = {
  set(access: string, refresh: string) {
    storage()?.setItem(ACCESS_KEY, access);
    storage()?.setItem(REFRESH_KEY, refresh);
  },
  getAccess: () => storage()?.getItem(ACCESS_KEY) ?? null,
  getRefresh: () => storage()?.getItem(REFRESH_KEY) ?? null,
  clear() {
    storage()?.removeItem(ACCESS_KEY);
    storage()?.removeItem(REFRESH_KEY);
  },
};

export function clearBannerDismissFlags() {
  if (typeof window === "undefined") return;
  const ss = window.sessionStorage;
  for (let i = ss.length - 1; i >= 0; i--) {
    const key = ss.key(i);
    if (key?.startsWith("pulse_setup_banner_dismissed")) {
      ss.removeItem(key);
    }
  }
}
