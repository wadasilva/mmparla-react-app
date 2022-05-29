const _ = require("lodash");
const express = require("express");
const router = express.Router();
const isBase64 = require("is-base64");
const User = require("../models/User");
const { logger, sentryLogger } = require("../startup/logging");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.post("/register", auth, async (req, res) => {
  let validationResult = new User().validateUser(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  validationResult = new User().validatePassword(req.body.password);

  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const existingUser = await User.findOne({
    email: req.body.email,
  });

  if (existingUser) return res.status(400).send("User already exists.");

  const user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  return res
    .status(200)
    .send(
      _.pick(user, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "photo",
        "createAt",
      ])
    );
});

router.get("/", auth, async (req, res) => {
  let query = User.find({}).sort("name");
  const result = await query.exec();

  return res.status(200).send(result);
});

router.get("/me", auth, async (req, res) => {
  let query = User.findOne({ _id: req.user._id });
  const result = await query.exec();

  return res.status(200).send(result);
});

module.exports = router;
