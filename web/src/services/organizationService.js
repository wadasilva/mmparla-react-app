import http from "./httpService";

export function getOrganization() {
  return http.get("/organizations");
}

export function addOrganization(data) {
  return http.post("/organizations", data);
}
