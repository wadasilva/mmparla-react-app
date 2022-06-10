const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const photoSchema = require("./schemas/photo");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },
  lastName: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },
  photo: {
    type: photoSchema,
    required: false,
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

userSchema.methods.validateUser = function (data) {
  const schema = Joi.object({
    email: Joi.string().required().max(100).email(),
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    password: Joi.string().required(),
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

  return schema.validate(data);
};

userSchema.methods.validatePassword = function (password) {
  return passwordComplexity(undefined, "Password").validate(password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: "1h",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
