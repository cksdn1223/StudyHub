import axios, { AxiosError } from "axios";

const TOKEN_KEY = "studyhub_jwt";

type AuthHandlers = {
  onUnauthorized?: () => void; // 401 시 logout 등 연결
};
const authHandlers: AuthHandlers = {};
export const setAuthHandlers = (handlers: AuthHandlers) => {
  Object.assign(authHandlers, handlers);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${token}`;
  }
  // JSON 기본 헤더 (FormData일 때는 설정하지 않음)
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
    if (status === 401 && authHandlers.onUnauthorized) {
      authHandlers.onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;