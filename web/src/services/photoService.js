import http from "../services/httpService";

export function getPhotos() {
  return http.get("/galleries");
}

export function uploadPhoto(data) {
  return http.post("/galleries", data);
}
