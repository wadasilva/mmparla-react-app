const { assert } = require('joi');
const Testimonial = require('../../models/testimonial');
const testimonialMocks = require('../mocks/dbTestimonialMocks');
const reqObjects = require('../mocks/reqObjects');
const request = require('supertest');
const config = require('config');

describe('/api/testimonials', () => {
    let server;
    let testimonial;
    let payload;

    //Should return 400 if no data is provided
    //should return 400 if foto is not provided
    //should return 400 if foto is not a valid base64
    //should return 400 if foto is larger than 5 MB
    //should return 400 if firstName is not provided
    //should return 400 if firstName is less than 3 characters
    //should return 400 if lastName is not provided
    //should return 400 if lastName is less than 3 characters
    //should return 400 if email is not provided
    //should return 400 if email is not a valid email

    describe('/POST', () => {
        beforeEach(async () => {
            ;({ httpServer: server} = require('../../index'));

            testimonial = new Testimonial(testimonialMocks.dbTestimonial);
            await testimonial.save();

            payload = reqObjects.validTestimonialModel();
        });

        afterEach(async () => {
            server.close();
            await Testimonial.deleteMany({});
        });

        it('should work!', async () => {
            const result = await Testimonial.findById(testimonial._id);
            expect(result).not.toBeNull();
        });

        it('should return 400 if no data is provided', async () => {
            payload = {};

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if photo is not provided', async () => {
            payload.photo = '';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if photo is not a valid base64 value', async () => {
            payload.photo = 'ddanji389';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it(`should return 400 if photo is larger than ${config.get('upload.maxSize')} ${config.get('upload.unit')}`, async () => {
            payload = reqObjects.largeBase64TestimonialModel();

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if extention is not provided', async () => {
            payload.extention = '';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if extention has an invalid value', async () => {
            payload.extention = '.pdg';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if firstName is not provided', async () => {
            payload.firstName = '';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if firstName is less than 3 characters', async () => {
            payload.firstName = 'Ho';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if lastName is not provided', async () => {
            payload.lastName = '';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if lastName is less than 3 characters', async () => {
            payload.lastName = 'Ho';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not provided', async () => {
            payload.email = '';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not a valid value', async () => {
            payload.email = 'test';

            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(400);
        });

        it('should return 200 if all is ok', async () => {
            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(res.status).toBe(200);
        });

        it('should have one element if all is ok', async () => {
            const res = await request(server)
                .post('/api/testimonials')
                .send(payload);

            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['_id', 'extention', 'firstName', 'lastName', 'email']));
        });

    });
});