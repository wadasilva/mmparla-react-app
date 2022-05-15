const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) throw new Error("File is null");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>
      resolve(reader.result.toString().replace(/^data:(.*,)?/, ""));
    reader.onerror = (error) => reject(error);
  });
};

const stripImageMimeType = (image) =>
  image.replace(/^data:image\/[a-z]+;base64,/, "");

const getFileExtention = (fileName) => fileName.split(".").pop().toLowerCase();

const utils = {
  toBase64,
  stripImageMimeType,
  getFileExtention,
};

export default utils;
