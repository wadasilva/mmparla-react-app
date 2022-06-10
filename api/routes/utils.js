const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { logger, sentryLogger } = require("../startup/logging");

router.get("/timezone", async (req, res) => {
  try {
    return res
      .status(200)
      .send(
        new Date().toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" })
      );
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
