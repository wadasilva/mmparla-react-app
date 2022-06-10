import http from "./httpService";

export function getCurrentTime() {
  return http.get("/utils/timezone");
}
