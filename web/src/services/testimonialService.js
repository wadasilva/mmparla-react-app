import http from "axios";

export function getTestimonials() {
  return http.get("/testimonials");
}
