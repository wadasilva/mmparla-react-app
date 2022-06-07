const mongoose = require("mongoose");
const config = require("config-secrets");
const { logger } = require("./logging");
const fs = require("fs");

module.exports = function () {
  const connectionString = config.get("db"); //mongodb://app:Jusarah%402022@mmparla_db:27017/
  logger.debug(`connectionString: ${connectionString}`);
  mongoose
    .connect(connectionString, {
      dbName: "mmparla",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${connectionString}...`));
};
