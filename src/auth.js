const AUTH_TOKEN_KEY = "client_registry_auth_token";
const AUTH_USER_KEY = "client_registry_auth_user";

const isBrowser = () => typeof window !== "undefined";

const emitAuthChange = () => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event("auth:changed"));
};

export const getAuthToken = () => {
  if (!isBrowser()) {
    return "";
  }

  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
};

export const getAuthUser = () => {
  if (!isBrowser()) {
    return "";
  }

  return localStorage.getItem(AUTH_USER_KEY) || "";
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const saveAuthSession = ({ token, user }) => {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, user?.username || "Admin");
  emitAuthChange();
};

export const clearAuthSession = () => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  emitAuthChange();
};
