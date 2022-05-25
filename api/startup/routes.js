const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const galleries = require("../routes/galleries");
const testimonials = require("../routes/testimonials");
const organizations = require("../routes/organizations");
const contact = require("../routes/contact");
const users = require("../routes/user");
const cors = require("cors");

var corsOptions = {
  origin: "*",
  exposedHeaders: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = function (app) {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(helmet());
  app.use(morgan("tiny"));
  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));
  app.use("/api/galleries", galleries);
  app.use("/api/testimonials", testimonials);
  app.use("/api/organizations", organizations);
  app.use("/api/users", users);
  app.use("/api/contact", contact(app));
};
