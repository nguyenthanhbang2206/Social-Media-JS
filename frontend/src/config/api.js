import axios from "axios";
import { getToken, updateToken, logout as keycloakLogout } from "../utils/keycloak";

export const API_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      // Try to update token if it's about to expire (5 seconds before)
      await updateToken(5);
      
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error updating token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let onUnauthorized = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const requestUrl = error.config?.url || "";
      const isLogoutRequest = requestUrl.includes("/auth/logout");
      
      if (!isLogoutRequest) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshed = await updateToken(30);
          if (refreshed) {
            const token = getToken();
            if (token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }

        // If refresh failed, logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        await keycloakLogout();
        if (onUnauthorized) onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export function setOnUnauthorizedCallback(callback) {
  onUnauthorized = callback;
}

export default api;

export const isPresentInFavorites = (favorites, restaurant) => {
  for (let item of favorites) {
    if (item.id === restaurant.id) {
      return true;
    }
  }
  return false;
};
