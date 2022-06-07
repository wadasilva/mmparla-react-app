const express = require("express");
const isBase64 = require("is-base64");
const config = require("config-secrets");
const Joi = require("joi");
const Testimonial = require("../models/testimonial");
const Invitation = require("../models/invitation");
const Organization = require("../models/organization");
const emailService = require("../services/nodemailerEmailService");
const router = express.Router();
const { logger, sentryLogger } = require("../startup/logging");
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

  // module.exports.sendNewTestimonialNotification = async (email) => {
  //   const info = await transporterWithTemplate.sendMail({
  //     from: config.get("emailService.smtpEmail"),
  //     to: config.get("emailService.smtpEmail"),
  //     subject: "Nuevo testimonial de un cliente!!!",
  //     template: "new-testimonial-notification",
  //     context: {
  //       email: config.get("emailService.smtpUser"),
  //       endpoint: `${config.get("webAppUrl")}/#testimonial-block`,
  //     },
  //   });

  //   console.log("Message sent: %s", info.messageId);
  // };

  const result = await emailService.send(
    req.body.email,
    config.get("emailService.smtpEmail"),
    "Nuevo testimonial de un cliente!!!",
    "This is a test body"
  );

  console.log("Message sent: %s", result.messageId);

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
    if (invitation.status != "finished") {
      // module.exports.sendInvitationMessage = async (email, code) => {
      //   const info = await transporterWithTemplate.sendMail({
      //     from: config.get("emailService.smtpUser"),
      //     to: email,
      //     subject: "Invitación para valorar el servicio prestado por MMParla",
      //     template: "testimonial-invitation",
      //     context: {
      //       email: email,
      //       endpoint: `${config.get("webAppUrl")}/testimonial/${code}`,
      //     },
      //   });

      //   console.log("Message sent: %s", info.messageId);
      // };

      const options = {
        fromFriendlyName: "Montaje de Muebles Parla",
        replyTo: config.get("emailService.smtpEmail"),
      };

      const result = await emailService.send(
        req.body.email,
        config.get("emailService.smtpEmail"),
        "Invitación para valorar el servicio prestado por MMParla",
        "This is a test body!",
        false,
        options
      );

      console.log("Message sent: %s", result.messageId);
    }
  } catch (error) {
    sentryLogger.log(error);
  }

  return res.status(200).send();
});

async function createInvitationMessage(body) {
  return new Promise(async (resolve, reject) => {
    try {
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
