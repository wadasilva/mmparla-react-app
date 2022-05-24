import http from "../services/httpService";

export function sendMessage(data) {
  return http.post("/contact", data);
}
