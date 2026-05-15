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
