const config = require("config-secrets");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const { logger, sentryLogger } = require("../startup/logging");
const Joi = require("joi");

let transporterWithTemplate = null;
let transporter = null;

module.exports.init = function () {
  transporter = nodemailer.createTransport({
    host: config.get("emailService.smtpHost"),
    port: config.get("emailService.smtpPort"),
    secure: config.get("emailService.smtpSecure"),
    auth: {
      user: config.get("emailService.smtpUser"),
      pass: config.get("emailService.smtpPassword"),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporterWithTemplate = nodemailer.createTransport({
    host: config.get("emailService.smtpHost"),
    port: config.get("emailService.smtpPort"),
    secure: config.get("emailService.smtpSecure"),
    auth: {
      user: config.get("emailService.smtpUser"),
      pass: config.get("emailService.smtpPassword"),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporterWithTemplate.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".hbs",
        layoutsDir: "./views",
        defaultLayout: "",
      },
      extName: ".hbs",
      viewPath: "./views",
    })
  );
};

module.exports.send = function (
  to,
  from,
  subject,
  body,
  isHtml = false,
  { fromFriendlyName = null, replyTo = null, cc = null, bcc = null } = {}
) {
  const message = { to, from, subject };

  const rules = {
    from: Joi.string().required().max(100).email(),
    subject: Joi.string().min(3).max(500),
  };

  if (to) {
    message.to = to;

    rules.to = Joi.string().max(100).email();
    if (Array.isArray(to)) {
      rules.to = Joi.array().items(Joi.string().max(100).email());
    }
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

  let schema = Joi.object(rules);
  let validationResult = schema.validate(message);
  if (validationResult.error?.details)
    throw Error(
      validationResult.error?.details?.map((detail) => detail.message)[0] ??
        "Error sending email."
    );

  schema = Joi.object({ fromFriendlyName: Joi.string().max(50) });
  validationResult = schema.validate({ fromFriendlyName: fromFriendlyName });
  if (validationResult.error?.details)
    throw Error(
      validationResult.error?.details?.map((detail) => detail.message)[0] ??
        "Error sending email."
    );

  if (fromFriendlyName) {
    message.from = `"${fromFriendlyName}" ${from}`;
  }

  message.sender = from;

  return transporter.sendMail(message);
};
