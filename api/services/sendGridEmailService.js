const config = require("config-secrets");
const sgMail = require("@sendgrid/mail");
const { logger, sentryLogger } = require("../startup/logging");
const errorMessages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) =>
  schema.options({ messages: errorMessages })
);

module.exports.init = function () {
  const apiKey = config.get("sendgridService.apiKey");
  if (!apiKey) {
    sentryLogger.error("FATAL ERROR: jwtPrivateKey is not defined.");
    logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
    throw new Error("Missing");
  }
  logger.error(`sendgrid Api Key: ${apiKey}`);
  sgMail.setApiKey(apiKey);
};

module.exports.send = function (
  to,
  from,
  subject,
  body,
  isHtml = false,
  { fromFriendlyName = null, replyTo = null, cc = null, bcc = null } = {}
) {
  return new Promise(async (resolve, reject) => {
    try {
      const message = { to, subject };

      const rules = {
        to: Joi.string().required().max(100).email(),
        subject: Joi.string().min(3).max(500),
      };

      if (fromFriendlyName) {
        message.from = { email: from, name: fromFriendlyName };

        rules.from = Joi.object({
          email: Joi.string().max(100).email(),
          name: Joi.string().max(50),
        });
      } else {
        message.from = from;
        rules.from = Joi.string().max(100).email();
      }

      if (cc) {
        message.cc = cc;

        rules.cc = Joi.string().max(100).email();
        if (Array.isArray(cc))
          rules.cc = Joi.array().items(Joi.string().max(100).email());
      }

      if (bcc) {
        message.bcc = bcc;

        rules.bcc = Joi.string().max(100).email();
        if (Array.isArray(bcc))
          rules.bcc = Joi.array().items(Joi.string().max(100).email());
      }

      if (replyTo) {
        message.replyTo = replyTo;

        rules.replyTo = Joi.string().max(100).email();
      }

      if (isHtml) {
        message.html = body;

        rules.html = Joi.string().required();
      } else {
        message.text = body;

        rules.text = Joi.string().required();
      }

      const schema = Joi.object(rules);
      const validationResult = schema.validate(message);
      if (validationResult.error?.details)
        reject(
          validationResult.error?.details[0].message ??
            "Error en la validación de datos del correo."
        );

      const result = await sgMail.send(message);
      resolve(result);
    } catch (err) {
      sentryLogger.log(err);
      reject(err);
    }
  });
};
