import http from 'axios';
import config from '../config/config.json';

export function getOrganization() {
    return http.get(`${config.apiUrl}/organizations`);
}

export function addOrganization(data) {
    return http.post(`${config.apiUrl}/organizations`, data);
}