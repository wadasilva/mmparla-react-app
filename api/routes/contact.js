const express = require("express");
const router = express.Router();
const { logger, sentryLogger } = require("../startup/logging");
const messages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) => schema.options({ messages }));
const Message = require("../models/Message");
const emailService = require("../services/nodemailerEmailService");
const config = require("config-secrets");

const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().required().max(100).email(),
  subject: Joi.string().optional().max(50),
  message: Joi.string().min(10).max(500).required(),
  sendCopy: Joi.bool().optional(),
});

router.post("/", async (req, res) => {
  try {
    const validationResult = schema.validate(req.body, {
      errors: { language: "es" },
    });

    if (validationResult.error?.details) {
      return res
        .status(400)
        .send(validationResult.error?.details.map((detail) => detail.message));
    }

    const options = {
      fromFriendlyName: "Contacto - Montajes de Muebles Parla",
      replyTo: req.body.email,
    };

    if (req.body.sendCopy === true) {
      options.cc = req.body.email;
    }

    const info = await emailService.send(
      config.get("emailService.smtpEmail"),
      config.get("emailService.smtpEmail"),
      req.body.subject,
      req.body.message,
      false,
      options
    );

    logger.info(`Message sent: ${info.messageId}`);

    const message = new Message(req.body);
    result = await message.save();
  } catch (error) {
    logger.error(error);
    sentryLogger.log(error);

    return res.status(500).send(`Internal server error. ${error}`);
  }

  return res.status(204).send();
});

module.exports = router;
