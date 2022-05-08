import http from "axios";

export function getPhotos() {
  return http.get("/galleries");
}
