const express = require("express");
const isBase64 = require("is-base64");
const config = require("config");
const Joi = require("joi");
const User = require("../models/User");
const router = express.Router();
const logger = require("../startup/logging");

const saltRounds = 10;

router.post("/register", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().max(100).email(),
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(3).max(255).required(),
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
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const existingUser = await User.findOne({
    email: req.body.email,
  });

  if (existingUser) return res.status(400).send("User already exists.");

  const user = new User(req.body);
  await user.save();

  return res.status(200).send();
});

router.get("/", async (req, res) => {
  let query = User.find({}).sort("name");

  //   if (req.query.accepted != null && req.query.accepted != undefined)
  //     query = query.where("accepted").equals(req.query.accepted);

  const result = await query.exec();

  return res.status(200).send(result);
});

module.exports = router;
