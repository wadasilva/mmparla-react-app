const request = require('supertest');
const { Gallery } = require('../../models/gallery');
const galleryMocks = require('../mocks/dbGalleryMocks');
const reqObjects = require('../mocks/reqObjects');
const config = require('config');
const { exceptions } = require('../../startup/logging');

describe('/api/galleries', () => {
    let server;
    let gallery;
    let payload;

    const exec = () => {
        return request(server)
            .post('/api/galleries')
            .send(payload);
    };

    describe('/POST', () => {
        beforeEach(async () => {
            server = require('../../index');

            gallery = new Gallery(galleryMocks.dbGallery);
            await gallery.save();

            payload = reqObjects.validGalleryModel();
        });

        afterEach(async () => {
            await server.close();
            await Gallery.deleteMany({});
        });

        //Return 401 if client is not logged in
        //Return 400 if image is not provided
        //Return 400 if image is not a valid b64 string
        //Return 400 if image has more than 5 bytes
        //Return 400 if name is not provided
        //Return 400 if name has an invalid extension
        //Return 400 if name is less than 6 characters
        //Return 400 if name is more than 255 characters
        //Return 400 if description is not provided
        //Return 400 if description has an invalid value
        //Return 200 if valid request

        it('should work!', async () => {
            const result = await Gallery.findById(gallery._id);
            expect(result).not.toBeNull();
        }, 10000);

        it('should return 400 if post data is not provided', async () => {
            payload = {};
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if image is not provided', async () => {
            payload.image = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if image is not a valid base64 value', async () => {
            payload.image = 'ddanji389';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it(`should return 400 if image size is larger than ${config.get('upload.maxSize')} ${config.get('upload.unit')}`, async () => {
            payload = reqObjects.largeBase64GalleryImageModel();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if extension is not provided', async () => {
            payload.extention = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if extension has an invalid value', async () => {
            payload.extention = 'ped';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is not provided', async () => {
            payload.description = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is less than 6 characters', async () => {
            payload.description = 'adg15';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is more than 255 characters', async () => {
            payload.description = new Array(257).join("A");

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 if is a valid request', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        }, 60000);
    });

    describe('/GET', () => {
        beforeEach(async () => {
            server = require('../../index');

            gallery = new Gallery(galleryMocks.dbGallery);
            await gallery.save();

            payload = reqObjects.validGalleryModel();
        });

        afterEach(async () => {
            await server.close();
            await Gallery.deleteMany({});
        });

        it('should return 200 with all collections', async () => {
            const galleries = await Gallery.insertMany([
                galleryMocks.dbGallery,
                galleryMocks.dbGallery,
                galleryMocks.dbGallery
            ]);

            const res = await request(server)
                .get('/api/galleries');

            expect(res.status).toBe(200);
            expect(res).not.toBe(null);
            expect(res.body.length).toBe(4);
        });
    });
});