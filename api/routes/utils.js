const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { logger, sentryLogger } = require("../startup/logging");
const format = require("date-format");

router.get("/timezone", async (req, res) => {
  try {
    const now = new Date();
    return res.status(200).send(format(now));
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
