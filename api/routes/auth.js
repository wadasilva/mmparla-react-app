const User = require("../models/User");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().max(100).email(),
    password: Joi.string().required(),
  });

  let validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  return res
    .header("x-auth-token", user.generateAuthToken())
    .status(200)
    .send(_.pick(user, ["_id", "firstName", "lastName", "email"]));
});

module.exports = router;
