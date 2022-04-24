const Cloudinary = require('cloudinary').v2;
//const webp = require("webp-converter");
const sharp = require('sharp');
const path = require('path');
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const config = require('config');
const fetch = require('fetch-base64');
const uniqueid = require('uniqid');

// this will grant 755 permission to webp executables
// webp.grant_permission();

Cloudinary.config({
    cloud_name: 'dahcc5hxq',
    api_key: '654913817767497',
    api_secret: 'Ynv-Y-shb3wW4MQBtM5Z8AM3yEg'
});

const responsiveBreakpoints = [{ create_derived: false, bytes_step: 20000, min_width: 200, max_width: 1400, max_images: 9 }];

/**
 * Generate responsive images with Cloudinary Service
 */
const generateResponsiveBreakpoints = async (imagePath, imageId = uniqueid()) => {
    return Cloudinary.uploader.upload(imagePath,
        {
            responsive_breakpoints: responsiveBreakpoints,
            public_id: imageId,
            type: 'private'
        },
    );
};

const downloadImageAsb64 = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await fetch.auto(url);
            resolve(result[0]);
        } catch (error) {
            reject(reason)
        }
        // http.get(url, function (response) {
        //     response.setEncoding("base64");
        //     let fileAsB64;
        //     response.on('data', (data) => fileAsB64 = data);
        //     response.on('end', () => { console.log(fileAsB64); resolve(fileAsB64); });
        // }).on('error', (error) => {
        //     reject(error);
        // });
    });
}

const downloadImage = (url, fileName) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName);
        const request = http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();  // close() is async, call cb after close completes.
                resolve(fileName);
            });
        }).on('error', function (err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(err)
        });;
    });
}

/**
 * Convert Images to webp
 */
// const convertToWebp = (imagePath) => {
//     let destinationPath = imagePath.replace(path.extname(imagePath), ".webp");
//     return webp.cwebp(imagePath, destinationPath, "-q 60", logging = "-v"); // "-q 60" refers to the quality of the image, from 0 to 100
// };

// const convertToWebpAsBase64 = (image, extension) => {
//     return new Promise((resolve, reject) => {
//         try {
//             console.log(`image: ${image}`);
//             console.log(`extention: ${extension}`);
//             console.log(`generated jpeg image path: ${path.resolve(config.get('paths.temp'))}/`);
//             let result = webp.str2webpstr(image, extension, "-v -q 80", path.resolve(config.get('paths.temp')) + '/');
//             resolve(result);
//         } catch (ex) {
//             reject(new Error(ex));
//         }
//     });

//     //return webp.str2webpstr(image, extension, "-q 80", path.resolve(config.get('paths.temp')) + '/');
// };

const convertToWebpAsBase64 = (fileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`fileName: ${fileName}`);
            let buffer = await sharp(fileName).webp().toBuffer();
            resolve(buffer.toString('base64'));
        } catch (ex) {
            reject(new Error(ex));
        }
    });

    //return webp.str2webpstr(image, extension, "-q 80", path.resolve(config.get('paths.temp')) + '/');
};

module.exports.generateResponsiveBreakpoints = generateResponsiveBreakpoints;
// module.exports.convertToWebp = convertToWebp;
module.exports.convertToWebpAsBase64 = convertToWebpAsBase64;
module.exports.downloadImageAsb64 = downloadImageAsb64;
module.exports.downloadImage = downloadImage;