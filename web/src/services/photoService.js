import http from "../services/httpService";
import config from "../config/config.json";

export function getPhotos() {
  return http.get("/galleries");
}

export function uploadPhoto(data) {
  return http.post("/galleries", data);
}

export function parseImages(data) {
  let images = [];

  if (data) {
    images = data.map((image) => {
      return {
        id: image.id,
        url: `${config.apiUrl}/${image.url}`,
        description: image.description,
        format: image.format,
        breakpoints: image.breakpoints
          .map((breakpoint) => {
            return {
              format: breakpoint.format,
              breakpoint: breakpoint.images
                .map((image) => `${config.apiUrl}/${image.url} ${image.width}w`)
                .join(","),
            };
          })
          .sort((a, b) => {
            if (a.format > b.format) return -1;
            if (a.format < b.format) return 1;

            return 0;
          }),
      };
    });
  }

  return images;
}
