import http from 'axios';
import config from '../config/config.json';

export function getPhotos() {
    return http.get(`${config.apiUrl}/galleries`);
}