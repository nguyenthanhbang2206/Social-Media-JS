import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8088',
  realm: 'social-media-realm',
  clientId: 'social-media-frontend',
};

const keycloak = new Keycloak(keycloakConfig);

let initPromise = null;

export const initKeycloak = () => {
  // Return existing promise if initialization is in progress or completed
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  }).catch((error) => {
    // Reset promise on error to allow retry
    initPromise = null;
    throw error;
  });
  
  return initPromise;
};

export const login = () => {
  return keycloak.login();
};

export const logout = () => {
  return keycloak.logout({ redirectUri: window.location.origin + '/login' });
};

export const register = () => {
  return keycloak.register();
};

export const getToken = () => {
  return keycloak.token;
};

export const isTokenValid = () => {
  return keycloak.isTokenValid();
};

export const updateToken = (minValidity = 5) => {
  return keycloak.updateToken(minValidity);
};

export const getUserInfo = () => {
  return keycloak.loadUserInfo();
};

export const getUsername = () => {
  return keycloak.tokenParsed?.preferred_username;
};

export const getEmail = () => {
  return keycloak.tokenParsed?.email;
};

export const getFullName = () => {
  return keycloak.tokenParsed?.name;
};

export const getUserId = () => {
  return keycloak.tokenParsed?.sub;
};

export const getRoles = () => {
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  return realmRoles;
};

export const hasRole = (role) => {
  return getRoles().includes(role);
};

export const isAuthenticated = () => {
  return keycloak.authenticated;
};

export default keycloak;
