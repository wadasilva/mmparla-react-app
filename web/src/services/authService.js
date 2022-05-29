import jwtDecode from "jwt-decode";
import http from "./httpService";

const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { headers } = await http.post("auth", { email, password });
  localStorage.setItem(tokenKey, headers["x-auth-token"]);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
};
