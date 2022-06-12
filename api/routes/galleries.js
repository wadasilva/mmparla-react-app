const { Gallery } = require("../models/gallery");
const http = require("http");
const fs = require("fs");
const path = require("path");
const isBase64 = require("is-base64");
const express = require("express");
const messages = require("../translation/validation-translations");
const Joi = require("joi").defaults((schema) => schema.options({ messages }));
const { logger } = require("../startup/logging");
const router = express.Router();
const imageService = require("../services/imageService");
const config = require("config");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const schema = Joi.object({
    image: Joi.string()
      .base64()
      .required()
      .custom((value, helpers) => {
        if (
          new Buffer.from(value, "base64").length > config.get("upload.maxSize")
        )
          //1048576 bytes = 1MB
          return helpers.message(
            `Image should not be greater than ${config.get(
              "upload.maxSize"
            )} ${config.get("upload.unit")}`
          );
      }, "custom validation"),
    description: Joi.string().min(6).max(255).required(),
    format: Joi.string()
      .pattern(
        /^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i,
        "Solo son permitidos ficheros con formatos de imagens"
      )
      .required(),
  });

  const validationResult = schema.validate(req.body, {
    errors: { language: "es" },
  });

  if (validationResult.error?.details) {
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));
  }

  //Download
  const image = `data:image/${req.body.format};base64,${req.body.image}`;
  let result;
  let gallery;
  let originalImage;
  let response;

  try {
    result = await imageService.generateResponsiveBreakpoints(image);
    // return res.status(200).send(result);
    originalImage = await imageService.downloadImageAsb64(result.url);
    response = await getBreakpointImages(result);

    gallery = new Gallery({
      image: originalImage,
      description: req.body.description,
      public_id: result.public_id,
      asset_id: result.asset_id,
      created_at: new Date(result.created_at),
      format: result.format.replace(".", ""),
      etag: result.etag,
      breakpoints: response,
    });

    await gallery.save();
  } catch (error) {
    console.log(new Error(error));
    return res.status(500).send();
  }

  return res.status(200).send(gallery);
});

router.get("/", async (req, res) => {
  const result = await Gallery.find();

  const galleries = await result.map((gallery) => {
    return {
      id: gallery._id,
      description: gallery.description,
      format: gallery.format,
      created_at: gallery.created_at,
      url: `galleries/image/${gallery._id}`,
      breakpoints: gallery.breakpoints.map((breakpoint) => {
        return {
          id: breakpoint._id,
          format: breakpoint.format,
          images: breakpoint.images.map((image) => {
            return {
              id: image._id,
              width: image.width,
              height: image.height,
              url: `galleries/breakpoint/${breakpoint._id}/image/${image._id}`,
            };
          }),
        };
      }),
    };
  });

  return res.status(200).send(galleries);
});

router.get("/image/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).send("gallery id must be provided");

  const gallery = await Gallery.findById(req.params.id);
  if (!gallery) return res.status(404).send();

  console.log("gallery image: ");
  console.log(gallery);

  const image = Buffer.from(gallery.image, "base64");

  res.writeHead(200, {
    "Content-Type": `image/${gallery.format}`,
    "Content-Length": image.length,
    "Content-Disposition": `inline; filename=${req.params.id}.${gallery.format}`,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31557600",
  });

  res.end(image);
});

router.get("/breakpoint/:breakpointId/image/:imageId", async (req, res) => {
  if (!req.params.breakpointId)
    return res.status(400).send("breakpointId must be provided");
  if (!req.params.imageId)
    return res.status(400).send("imageId must be provided");

  let gallery = await Gallery.findOne({
    "breakpoints._id": req.params.breakpointId,
    "breakpoints.images._id": req.params.imageId,
  });
  if (!gallery) return res.status(404).send();

  let breakpoint = gallery.breakpoints.find(
    (breakpoint) => breakpoint._id == req.params.breakpointId
  );

  // Only for test
  let breakpointFiltering = gallery.breakpoints
    .filter((breakpoint) => breakpoint._id == req.params.breakpointId)
    .find((breakpoint) => breakpoint._id == req.params.breakpointId);

  let format = breakpointFiltering.format;
  // End only for test

  let images = breakpoint.images.find(
    (image) => image._id == req.params.imageId
  );
  const image = Buffer.from(images.image, "base64");

  res.writeHead(200, {
    "Content-Type": `image/${format}`,
    "Content-Length": image.length,
    "Content-Disposition": `inline; filename=${req.params.imageId}.${format}`,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31557600",
  });

  res.end(image);
});

router.delete("/", auth, async (req, res) => {
  console.log("picture to delete: " + req.body.id);

  if (!req.body.id) return res.status(400).send("id is required");

  const gallery = await Gallery.findOne({ _id: req.body.id });
  if (!gallery) return res.status(404).send();

  await gallery.remove();

  return res.status(200).send(gallery);
});

router.post("/invite", auth, async (req, res) => {
  const schema = Joi.object({
    emails: Joi.array().required().items(Joi.string().email()),
    name: Joi.string().min(6).max(255).required(),
    description: Joi.string().min(6).max(255).required(),
    format: Joi.string()
      .pattern(/^.?(gif|jpe?g|tiff?|png|webp|bmp)$/i, "Only image extentions")
      .required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error?.details) {
    return res
      .status(400)
      .send(validationResult.error?.details.map((detail) => detail.message));
  }

  // if (Object.keys(req.body).length === 0) return res.status(400).send();
  // if (!req.body.image) return res.status(400).send();
  // if (!isBase64(req.body.image)) return res.status(400).send();
  // if (new Buffer.from(req.body.image).length > 5242880) return res.status(400).send();
  // if (!req.body.format) return res.status(400).send();
  // if (!req.body.description) return res.status(400).send();
  // if (req.body.description.length < 6) return res.status(400).send();
  // if (req.body.description.length > 255) return res.status(400).send();

  //Download
  const image = `data:image/${req.body.format};base64,${req.body.image}`;
  let result;
  let gallery;
  let originalImage;
  let response;

  try {
    result = await imageService.generateResponsiveBreakpoints(image);
    originalImage = await imageService.downloadImageAsb64(result.url);
    response = await getBreakpointImages(result);

    gallery = new Gallery({
      image: originalImage,
      description: req.body.description,
      public_id: result.public_id,
      asset_id: result.asset_id,
      created_at: new Date(result.created_at),
      format: result.format.replace(".", ""),
      etag: result.etag,
      breakpoints: response,
    });

    await gallery.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }

  return res.status(200).send(gallery);
});

function getBreakpointImages(result) {
  return new Promise((resolve, reject) => {
    let original = {
      format: result.format,
      images: [],
    };

    let webp = {
      format: "webp",
      isPrefered: true,
      images: [],
    };

    try {
      Array.from(result.responsive_breakpoints).forEach((item) => {
        Array.from(item.breakpoints).forEach(async (subitem, index) => {
          // let response = await saveFile(subitem, result.format);
          let now = Date.now();
          let filePath = `${path.resolve(config.get("paths.temp"))}/${now}@${
            subitem.width
          }w.${result.format}`;

          console.log(`jpg filePath: ${filePath}`);
          await imageService.downloadImage(subitem.url, filePath);

          let fileAsBase64 = await fs.promises.readFile(filePath, {
            encoding: "base64",
          });
          console.log(`file as b64: ${fileAsBase64.substr(0, 10)}`);

          original.images.push({
            image: fileAsBase64,
            width: subitem.width,
            height: subitem.height,
            url: subitem.url,
            secure_url: subitem.secure_url,
          });

          fileAsBase64 = await imageService.convertToWebpAsBase64(filePath);
          console.log(`File as webp base64: ${fileAsBase64.substr(0, 10)}`);

          webp.images.push({
            image: fileAsBase64,
            width: subitem.width,
            height: subitem.height,
          });

          if (index == 0) resolve([original, webp]);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function saveFile(model, format) {
  let now = Date.now();
  fileName = `${config.get("paths.temp")}${now}@${model.width}w.${format}`;

  try {
    fileName = await imageService.downloadImage(model.url, fileName);
    console.log(`downloaded fileName: ${fileName}`);
    await imageService.convertToWebp(fileName);
  } catch (ex) {
    console.log("base64 error:");
    console.log(ex);
  }
}

module.exports = router;
