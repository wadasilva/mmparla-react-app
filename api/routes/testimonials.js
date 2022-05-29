const express = require("express");
const isBase64 = require("is-base64");
const config = require("config");
const Joi = require("joi");
const Testimonial = require("../models/testimonial");
const Invitation = require("../models/invitation");
const Organization = require("../models/organization");
const emailService = require("../services/emailService");
const router = express.Router();
const { logger } = require("../startup/logging");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const schema = Joi.object({
    photo: Joi.object({
      image: Joi.string()
        .base64()
        .required()
        .custom((value, helpers) => {
          if (
            new Buffer.from(value, "base64").length >
            config.get("upload.maxSize")
          )
            //1048576 bytes = 1MB
            return helpers.message(
              `Picture should not be greater than ${config.get(
                "upload.maxSize"
              )} ${config.get("upload.unit")}`
            );
        }, "custom validation"),
      format: Joi.string()
        .pattern(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions")
        .required(),
    }),
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().required().max(100).email(),
    rol: Joi.string().optional().min(3).max(50),
    message: Joi.string().min(10).max(500).required(),
    code: Joi.required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const invitation = await Invitation.findOne({ _id: req.body.code });
  if (!invitation || invitation?.status == "finished")
    return res.status(200).send("provided code is not valid");

  const testimonial = new Testimonial(req.body);
  testimonial.invitation = invitation._id;
  testimonial.organization = invitation.organization._id;
  await testimonial.save();

  invitation.status = "finished";
  await invitation.save();
  emailService.sendNewTestimonialNotification(req.body.email);

  return res.status(200).send(testimonial);
});

router.get("/", async (req, res) => {
  let query = Testimonial.find({});

  if (!req.user) {
    query = query.where({ accepted: true });
  }

  query = query.sort({ createAt: -1 });

  query = query.populate([
    {
      path: "invitation",
      model: "invitation",
    },
    {
      path: "organization",
      model: "organization",
    },
  ]);

  const result = await query.exec();

  return res.status(200).send(result);
});

router.put("/", auth, async (req, res) => {
  if (!req.body.id) return res.status(400).send("id is required");
  if (req.body.accepted == null || req.body.accepted == undefined)
    return res.status(400).send("accepted is required");

  const testimonial = await Testimonial.findOne({ _id: req.body.id });
  if (!testimonial) return res.status(404).send();

  testimonial.accepted = req.body.accepted;
  await testimonial.save();

  return res.status(200).send(testimonial);
});

router.get("/invite/:code", async (req, res) => {
  let invitation = null;
  try {
    invitation = await Invitation.findOne({ _id: req.params.code });
  } catch (error) {
    console.log(error);
  }

  if (!invitation) return res.status(404).send("Invitation not found");

  return res.status(200).send(invitation);
});

router.post("/invite", auth, async (req, res) => {
  const schema = Joi.object({
    organization: Joi.string().required(),
    email: Joi.string().required().email(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail?.message));

  const organization = await Organization.findOne({
    _id: req.body.organization,
  });
  if (!organization) return res.status(404).send("Organization not found");

  try {
    logger.debug(`creating invitation for ${req.body.email}`);

    let invitation = await createInvitationMessage(req.body);
    if (invitation.status != "finished")
      await emailService.sendInvitationMessage(req.body.email, invitation._id);
  } catch (error) {
    console.log(error);
  }

  return res.status(200).send();
});

async function createInvitationMessage(body) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`body: ${JSON.stringify(body)}`);
      let invitation =
        (await Invitation.findOne({
          email: body.email,
          organization: body.organization,
        })) ?? new Invitation();
      if (["finished"].includes(invitation.status)) return resolve(invitation);

      invitation.status = "pending";
      invitation.email = body.email;
      invitation.organization = body.organization;

      await invitation.save();

      resolve(invitation);
    } catch (err) {
      reject(new Error(err));
    }
  });
}

module.exports = router;
