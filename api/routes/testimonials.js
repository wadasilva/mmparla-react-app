const express = require('express');
const isBase64 = require('is-base64');
const config = require('config');
const Joi = require('joi');
const Testimonial = require('../models/testimonial');
const Invitation = require('../models/invitation');
const emailService = require('../services/emailService');
const router = express.Router();
const logger = require('../startup/logging');

router.post('/', async (req, res) => {
    const schema = Joi.object({
        photo: Joi.string().base64().required().custom((value, helpers) => {
            if (new Buffer.from(value, 'base64').length > config.get('upload.maxSize')) //1048576 bytes = 1MB
                return helpers.message(`Picture should not be greater than ${config.get('upload.maxSize')} ${config.get('upload.unit')}`);

        }, 'custom validation'),
        extention: Joi.string().pattern(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, 'Only image extentions').required(),
        firstName: Joi.string().min(3).max(100).required(),
        lastName: Joi.string().min(3).max(100).required(),
        email: Joi.string().required().email(),
        message: Joi.string().min(10).max(500).required(),
        accepted: Joi.boolean(),
        code: Joi.required()
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error?.details) return res.status(400).send(validationResult.error?.details.map(detail => detail.message));

    const invitation = await Invitation.findOne({ _id: req.body.code });
    if (!invitation || invitation?.status == 'finished') return res.status(200).send('provided code is not valid');

    const testimonial = new Testimonial(req.body);
    await testimonial.save();

    invitation.status = 'finished';
    await invitation.save();
    emailService.sendNewTestimonialNotification(req.body.email);

    return res.status(200).send(testimonial);
});

router.get('/', async (req, res) => {
    let query = Testimonial.find({});

    if (req.query.accepted != null && req.query.accepted != undefined)
        query = query.where('accepted').equals(req.query.accepted);

    const result = await query.exec();

    return res.status(200).send(result);
});

router.put('/', async (req, res) => {
    if (!req.body.id) return res.status(400).send('id is required');
    if (req.body.state == null || req.body.state == undefined) return res.status(400).send('state is required');

    const testimonial = await Testimonial.findOne({ _id: req.body.id });
    if (!testimonial) return res.status(404).send();

    testimonial.accepted = req.body.state;
    await testimonial.save();

    return res.status(200).send(testimonial);
});

router.post('/invite', async (req, res) => {
    const schema = Joi.array().items(Joi.string().required().email());

    const validationResult = schema.validate(req.body);
    if (validationResult.error?.details) return res.status(400).send(validationResult.error?.details.map(detail => detail?.message));

    Array.from(req.body).forEach(async (email) => {
        try {
            logger.debug(`creating invitation for ${email}`);
            
            let invitation = await createInvitationMessage(email);
            if (invitation.status != "finished")
                await emailService.sendInvitationMessage(email, invitation._id);
            
        } catch (error) {
            console.log(error);
        }
    });

    return res.status(200).send({});
});

async function createInvitationMessage(email) {
    return new Promise(async (resolve, reject) => {
        try {
            let invitation = await Invitation.findOne({ email: email }) ?? new Invitation();
            if (["finished"].includes(invitation.status)) return resolve(invitation);

            invitation.status = 'pending';
            invitation.email = email;

            await invitation.save();

            resolve(invitation);

        } catch (err) {
            reject(new Error(err));
        }
    });
}

module.exports = router;