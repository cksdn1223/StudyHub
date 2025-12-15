import axios, { AxiosError, AxiosRequestConfig } from "axios";

const TOKEN_KEY = "studyhub_jwt";

type AuthHandlers = {
  onUnauthorized?: () => void; // 401 시 logout 등 연결
};
const authHandlers: AuthHandlers = {};
export const setAuthHandlers = (handlers: AuthHandlers) => {
  Object.assign(authHandlers, handlers);
};

type ApiRequestConfig = AxiosRequestConfig & {
  skipAuthLogout?: boolean;
};
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthLogout?: boolean;
  }
}
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${token.startsWith("Bearer ") ? "" : "Bearer "}${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers = config.headers ?? {};
    config.headers["Content-Type"] = config.headers["Content-Type"] ?? "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;

    const config = error.config as ApiRequestConfig;
    const skip = config?.skipAuthLogout === true;

    if (status === 401 && !skip && authHandlers.onUnauthorized) {
      authHandlers.onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;