const express = require("express");
const router = express.Router();
const exphbs = require("express-handlebars");
const hbs = require("nodemailer-express-handlebars");
const { logger } = require("../startup/logging");
const Joi = require("joi");
const Message = require("../models/Message");
const emailService = require("../services/emailService");

const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().required().max(100).email(),
  subject: Joi.string().optional().max(50),
  message: Joi.string().min(10).max(500).required(),
});

module.exports = function (app) {
  this.app = app;
  app.engine(".hbs", exphbs({ extname: ".hbs", layoutsDir: "./views" }));
  app.set("view engine", ".hbs");

  router.post("/", async (req, res) => {
    const validationResult = schema.validate(req.body);

    if (validationResult.error?.details) {
      return res
        .status(400)
        .send(validationResult.error?.details.map((detail) => detail.message));
    }

    const message = new Message(req.body);
    try {
      result = await message.save();
      emailService.sendCostomerMessage(req.body);
    } catch (error) {
      logger.error(error);

      return res.status(500).send(`Internal server error. ${error}`);
    }

    return res.status(204).send();
  });

  return router;
};
