import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, syncUserWithKeycloak } from "./api/Auth/Action";
import { setOnUnauthorizedCallback } from "./config/api";
import AppRouter from "./router/router";
import useNotificationWebSocket from "./config/useNotificationWebSocket";
import { initKeycloak, isAuthenticated, getToken } from "./utils/keycloak";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [keycloakError, setKeycloakError] = useState(false);

  useNotificationWebSocket();

  // Initialize Keycloak on app load
  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        const authenticated = await initKeycloak();
        setKeycloakInitialized(true);
        
        if (authenticated) {
          // User is authenticated with Keycloak, sync with backend
          dispatch(syncUserWithKeycloak(navigate));
        }
      } catch (error) {
        console.error("Keycloak initialization error:", error);
        setKeycloakError(true);
        setKeycloakInitialized(true);
      }
    };

    initializeKeycloak();
  }, [dispatch, navigate]);

  // Get profile if user exists but not in Redux
  useEffect(() => {
    if (keycloakInitialized && isAuthenticated() && !user) {
      dispatch(getProfile(getToken()));
    }
  }, [dispatch, user, keycloakInitialized]);

  // Register unauthorized callback
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      dispatch(logout());
      navigate("/login");
    });
  }, [navigate, dispatch]);

  // Show loading state while Keycloak initializes
  if (!keycloakInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if Keycloak initialization failed
  if (keycloakError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to initialize authentication</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
