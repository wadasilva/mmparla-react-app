import http from "./httpService";

export function getInvitation(id) {
  return http.get(`/testimonials/invite/${id}`);
}

export function revokeInvitation(id) {
  return http.get(`/testimonials/revoke/${id}`);
}

export function sendInvitation(data) {
  return http.post("/testimonials/invite", data);
}

export function getTestimonials() {
  return http.get("/testimonials");
}

export function addTestimonial(data) {
  return http.post(`/testimonials/`, data);
}

export function setState(data) {
  return http.put(`/testimonials/`, data);
}
