import {
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_REQUEST,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  LOGIN_FAILURE,
  GET_USER_PROFILE_FAILURE,
} from "./ActionType";
import api from "../../config/api";
import keycloak, {
  getToken,
  getEmail,
  getFullName,
  getUserId,
  getRoles,
  logout as keycloakLogout,
} from "../../utils/keycloak";

export const register =
  ({ userData, navigate }) =>
  async (dispatch) => {
    // Registration is now handled by Keycloak
    // This action is deprecated and should not be called
    console.warn("register action is deprecated. Use Keycloak registration instead.");
    dispatch({ type: REGISTER_FAILURE, payload: "Please use Keycloak registration" });
  };

export const login =
  ({ userData, navigate }) =>
  async (dispatch) => {
    // Login is now handled by Keycloak
    // This action is deprecated and should not be called
    console.warn("login action is deprecated. Use Keycloak login instead.");
    dispatch({ type: LOGIN_FAILURE, payload: "Please use Keycloak login" });
  };

export const syncUserWithKeycloak = (navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const token = getToken();
    const email = getEmail();
    const fullName = getFullName();
    const userId = getUserId();
    const roles = getRoles();

    if (!token || !email) {
      throw new Error("No valid Keycloak token");
    }

    // Sync user with backend
    const { data } = await api.post(`/auth/sync`, {
      email,
      fullName,
      keycloakUserId: userId,
      role: roles.includes("ADMIN") ? "ADMIN" : "USER",
    });

    // Save user info to localStorage
    const userInfo = {
      id: data.data.id,
      email: email,
      fullName: fullName,
      role: roles.includes("ADMIN") ? "ADMIN" : "USER",
    };
    localStorage.setItem("user", JSON.stringify(userInfo));

    // Navigate based on role
    if (roles.includes("ADMIN")) {
      navigate("/admin");
    } else {
      navigate("/");
    }

    dispatch({ type: LOGIN_SUCCESS, payload: token });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to sync user with backend. Please try again.";
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    console.error("Sync User Error:", errorMessage);
  }
};

export const getProfile = (token) => async (dispatch) => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  try {
    const { data } = await api.get("/users/profile");

    // Save user info to localStorage
    localStorage.setItem("user", JSON.stringify(data.data));

    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to load profile. Please try again.";
    dispatch({ type: GET_USER_PROFILE_FAILURE, payload: errorMessage });
    console.error("Get Profile Error:", errorMessage);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: LOGOUT });
      keycloakLogout();
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    // Call Keycloak logout
    await keycloakLogout();
  } catch (error) {
    console.error("Keycloak logout error:", error);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: LOGOUT });
};
