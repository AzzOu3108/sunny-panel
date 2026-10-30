import axios from "axios";


/**
 * Central API client for the whole app.
 *
 * Every request goes through this axios instance so that:
 *  - the base URL is configured in one place (VITE_API_URL or the dev proxy),
 *  - the access token is attached automatically,
 *  - a 401 triggers a silent refresh-token exchange and retries the request,
 *  - a failed refresh logs the user out and sends them to /login.
 *
 * Backend contract (Express):
 *  POST /auth/signup  { fullName, email, password }        -> { accessToken, refreshToken, user }
 *  POST /auth/login   { email, password }                  -> { accessToken, refreshToken, user }
 *  POST /auth/refresh { refreshToken }                     -> { accessToken }
 *  POST /auth/logout  { refreshToken }                     -> 204
 *  GET  /auth/me                                          -> { user }
 *  GET  /projects                                         -> Project[]
 *  POST /projects     { title, dueDate, tasks: string[] } -> Project
 *  DELETE /projects/:projectId                             -> 204
 *  POST /projects/:projectId/tasks  { tasks: string[] }    -> Project (updated)
 *  PATCH /projects/:projectId/tasks/:taskId { completed }  -> Task
 *  GET  /stats                                            -> { totalProjects, completedTasks, pendingTasks }
 *
 * Shapes: Project { id, title, dueDate: "YYYY-MM-DD", tasks: Task[] }
 *         Task    { id, text, completed }
 * Errors: { error: "human readable message" } with the right status code.
 */

const API_URL = import.meta.env.VITE_API_URL || "/api";
const ACCESS_TOKEN_KEY = "manageit.accessToken";
const REFRESH_TOKEN_KEY = "manageit.refreshToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getRefreshToken());
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available.");

  refreshPromise ??= api
    .post("/auth/refresh", { refreshToken })
    .then((response) => response.data)
    .finally(() => {
      refreshPromise = null;
    });

  const { accessToken } = await refreshPromise;
  if (!accessToken) throw new Error("The refresh response did not include an access token.");

  setTokens(accessToken, refreshToken);
  return accessToken;
}

function redirectToLogin() {
  clearTokens();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes("/auth/");
    if (error.response?.status !== 401 || !original || original._retried || isAuthCall) {
      return Promise.reject(error);
    }

    original._retried = true;
    try {
      const accessToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      if (getRefreshToken()) redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.error || error?.message || fallback;
}

export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) await api.post("/auth/logout", { refreshToken });
  } finally {
    clearTokens();
  }
}

export default api;
