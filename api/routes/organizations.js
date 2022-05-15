const express = require("express");
const isBase64 = require("is-base64");
const config = require("config");
const Joi = require("joi");
const Organization = require("../models/organization");
const router = express.Router();
const logger = require("../startup/logging");

const schema = Joi.object({
  logo: Joi.object({
    image: Joi.string()
      .base64()
      .required()
      .custom((value, helpers) => {
        if (
          new Buffer.from(value, "base64").length > config.get("upload.maxSize")
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
  name: Joi.string().min(3).max(255).required(),
});

router.post("/", async (req, res) => {
  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const existingOrganization = await Organization.findOne({
    name: req.body.name,
  });

  if (existingOrganization)
    return res.status(400).send("Duplicated name for organization.");

  const organization = new Organization(req.body);
  await organization.save();

  return res.status(200).send(organization);
});

router.get("/", async (req, res) => {
  let query = Organization.find({}).sort("name");

  //   if (req.query.accepted != null && req.query.accepted != undefined)
  //     query = query.where("accepted").equals(req.query.accepted);

  const result = await query.exec();

  return res.status(200).send(result);
});

router.put("/:id", async (req, res) => {
  if (!req.params.id) return res.status(400).send("id is required");

  const organization = await Organization.findOne({ _id: req.params.id });
  if (!organization) return res.status(404).send("Organization not found.");

  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const existingOrganization = await Organization.findOne({
    name: req.body.name,
  });
  if (existingOrganization)
    return res.status(400).send("Duplicated name for organization.");

  organization.name = req.body.name;
  organization.logo.image = req.body.logo.image;
  organization.logo.format = req.body.logo.format;
  await organization.save();

  return res.status(200).send(organization);
});

module.exports = router;
