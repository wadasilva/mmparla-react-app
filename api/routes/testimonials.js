const express = require("express");
const isBase64 = require("is-base64");
const config = require("config-secrets");
const messages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) => schema.options({ messages }));
const Testimonial = require("../models/testimonial");
const Invitation = require("../models/invitation");
const Organization = require("../models/organization");
const emailService = require("../services/nodemailerEmailService");
const templateService = require("../services/templateService");
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
              `Imagen no debe ser mayor de ${config.get(
                "upload.maxSize"
              )} ${config.get("upload.unit")}`
            );
        }, "Tamaño de imagen excedido"),
      format: Joi.string()
        .pattern(
          /^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i,
          "Solo son permitidos ficheros con formato de imagen"
        )
        .required(),
    }),
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().required().max(100).email(),
    rol: Joi.string().optional().min(3).max(50),
    message: Joi.string().min(10).max(500).required(),
    code: Joi.required(),
  });

  try {
    const validationResult = schema.validate(req.body, {
      errors: { language: "es" },
    });

    console.log(validationResult.error);
    if (validationResult.error?.details)
      return res
        .status(400)
        .send(validationResult.error?.details.map((detail) => detail.message));

    const invitation = await Invitation.findOne({ _id: req.body.code });

    if (
      !invitation ||
      invitation?.status === "finished" ||
      invitation?.status === "revoked"
    ) {
      logger.error("invitation is finished");
      return res.status(403).send("Codigo invalido");
    }

    const testimonial = new Testimonial(req.body);
    testimonial.invitation = invitation._id;
    testimonial.organization = invitation.organization._id;
    await testimonial.save();

    invitation.status = "finished";
    await invitation.save();

    const template = await templateService.compile(
      "new-testimonial-notification.hbs",
      {
        email: req.body.email.split("@")[0],
        endpoint: config.get("webAppUrl"),
        logoUrl: `${config.get("webAppUrl")}/images/parla.png`,
      }
    );

    const options = { fromFriendlyName: "Montaje de Muebles Parla" };

    const info = await emailService.send(
      req.body.email,
      config.get("emailService.smtpEmail"),
      "Nuevo testimonial de un cliente!",
      template,
      true,
      options
    );

    logger.info(`Message sent: ${info.messageId}`);

    return res.status(200).send(testimonial);
  } catch (err) {
    logger.log(err);
    sentryLogger(err);
    return res.status(500).send(err);
  }
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
  if (!req.body.id) return res.status(400).send("Id es requerido");
  if (req.body.accepted == null || req.body.accepted == undefined)
    return res.status(400).send("Campo accepted es requerido");

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
    if (!invitation || invitation.status === "finished")
      return res.status(404).send("Codigo invalido");
  } catch (error) {
    logger.error(error);
    sentryLogger.log(error);
    return res.status(500).send(error);
  }

  return res.status(200).send(invitation);
});

router.get("/revoke/:code", async (req, res) => {
  try {
    const invitation = await Invitation.findOne({ _id: req.params.code });
    if (
      !invitation ||
      invitation.status === "finished" ||
      invitation.status === "revoked"
    ) {
      return res.status(404).send("Codigo invalido");
    }

    invitation.status = "revoked";
    await invitation.save();
  } catch (error) {
    logger.error(JSON.stringify(error));
    sentryLogger.log(error);
    return res.status(500).send(error);
  }

  return res.status(204).send();
});

router.post("/invite", auth, async (req, res) => {
  const schema = Joi.object({
    organization: Joi.string().required(),
    email: Joi.string().required().email(),
  });

  const validationResult = schema.validate(req.body, {
    errors: { language: "es" },
  });

  console.log(validationResult.error);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail?.message));

  const organization = await Organization.findOne({
    _id: req.body.organization,
  });

  if (!organization) return res.status(404).send("Organización no existente");

  try {
    logger.debug(`creating invitation for ${req.body.email}`);

    let invitation = await createInvitationMessage(req.body);
    if (invitation.status === "finished") return res.status(200).send();

    const template = await templateService.compile(
      "testimonial-invitation.hbs",
      {
        email: req.body.email.split("@")[0],
        endpoint: config.get("webAppUrl"),
        code: invitation._id,
      }
    );

    const options = {
      fromFriendlyName: "Montaje de Muebles Parla",
      replyTo: config.get("emailService.smtpEmail"),
    };

    const info = await emailService.send(
      req.body.email,
      config.get("emailService.smtpEmail"),
      `¡Hola, ${
        req.body.email.split("@")[0]
      }! Que tal ha sido tu experiencia con Montaje de Muebles Parla?`,
      template,
      true,
      options
    );

    await invitation.save();

    logger.info(`Message sent: ${info.messageId}`);
  } catch (err) {
    logger.error(err);
    sentryLogger.log(err);
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

      resolve(invitation);
    } catch (err) {
      reject(new Error(err));
    }
  });
}

module.exports = router;
