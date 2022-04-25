import http from "axios";
import config from "../config/config.json";

export function getTestimonials() {
    return http.get(`${config.apiUrl}/testimonials`);
}
