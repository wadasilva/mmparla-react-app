const config = require("config-secrets");
const sgMail = require("@sendgrid/mail");
const { logger, sentryLogger } = require("../startup/logging");
const Joi = require("joi");

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

    rules.html = Joi.string().max(500).required();
  } else {
    message.text = body;

    rules.text = Joi.string().max(500).required();
  }

  logger.debug(`nodemailer send() => ${JSON.stringify(message)}`);

  const schema = Joi.object(rules);
  const validationResult = schema.validate(message);
  if (validationResult.error?.details)
    throw Error(
      validationResult.error?.details?.map((detail) => detail.message)[0] ??
        "Error sending email."
    );

  return sgMail.send(message);
};
