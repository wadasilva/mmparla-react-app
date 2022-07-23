const config = require("config");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const { logger, sentryLogger } = require("../startup/logging");
const errorMessages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) =>
  schema.options({ messages: errorMessages })
);

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
  return new Promise(async (resolve, reject) => {
    try {
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

        rules.html = Joi.string().required();
      } else {
        message.text = body;

        rules.text = Joi.string().required();
      }

      let schema = Joi.object(rules);
      let validationResult = schema.validate(message, {
        errors: { language: "es" },
      });

      if (validationResult.error?.details) {
        reject(
          validationResult.error?.details[0].message ??
            "Error en la validación de datos del correo."
        );
      }

      schema = Joi.object({ fromFriendlyName: Joi.string().max(50) });
      validationResult = schema.validate(
        {
          fromFriendlyName: fromFriendlyName,
        },
        { errors: { language: "es" } }
      );

      if (validationResult.error?.details) {
        reject(
          validationResult.error?.details[0].message ??
            "Error en la validación de datos del correo."
        );
      }

      if (fromFriendlyName) {
        message.from = `"${fromFriendlyName}" ${from}`;
      }

      message.sender = from;

      const result = await transporter.sendMail(message);
      resolve(result);
    } catch (err) {
      sentryLogger.log(err);
      reject(err);
    }
  });
};
