const express = require("express");
const isBase64 = require("is-base64");
const config = require("config");
const messages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) => schema.options({ messages }));
const Organization = require("../models/organization");
const router = express.Router();
const { logger, sentryLogger } = require("../startup/logging");
const auth = require("../middleware/auth");

const schema = Joi.object({
  photo: Joi.object({
    image: Joi.string()
      .base64()
      .required()
      .custom((value, helpers) => {
        if (
          new Buffer.from(value, "base64").length > config.get("upload.maxSize")
        )
          //1048576 bytes = 1MB
          return helpers.message(
            `Imagen no debe ser mayor que ${config.get(
              "upload.maxSize"
            )} ${config.get("upload.unit")}`
          );
      }, "Tamaño de imagen excedido"),
    format: Joi.string()
      .pattern(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions")
      .required(),
  }),
  name: Joi.string().min(3).max(255).required(),
});

router.post("/", auth, async (req, res) => {
  try {
    const validationResult = schema.validate(req.body, {
      errors: { language: "es" },
    });

    console.log(validationResult.error);
    if (validationResult.error?.details)
      return res
        .status(400)
        .send(validationResult.error?.details.map((detail) => detail.message));

    const existingOrganization = await Organization.findOne({
      name: req.body.name,
    });

    if (existingOrganization)
      return res
        .status(400)
        .send(
          `Ya existe una organización con el nombre ${existingOrganization.name}.`
        );

    const organization = new Organization(req.body);
    await organization.save();

    return res.status(200).send(organization);
  } catch (err) {
    logger.error(err);
    sentryLogger.log(err);
    return res.status(500).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  let query = Organization.find({}).sort("name");

  //   if (req.query.accepted != null && req.query.accepted != undefined)
  //     query = query.where("accepted").equals(req.query.accepted);

  const result = await query.exec();

  return res.status(200).send(result);
});

router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) return res.status(400).send("id es requerido");

  const organization = await Organization.findOne({ _id: req.params.id });
  if (!organization) return res.status(404).send("Organización no encontrada.");

  const validationResult = schema.validate(req.body);
  if (validationResult.error?.details)
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));

  const existingOrganization = await Organization.findOne({
    name: req.body.name,
  });
  if (existingOrganization)
    return res
      .status(400)
      .send(
        `Ya existe una organización con el nombre ${existingOrganization.name}.`
      );

  organization.name = req.body.name;
  organization.photo.image = req.body.photo.image;
  organization.photo.format = req.body.photo.format;
  await organization.save();

  return res.status(200).send(organization);
});

module.exports = router;
