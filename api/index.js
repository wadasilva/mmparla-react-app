const config = require("config-secrets");
require("./startup/folders")();
const starttupDebugger = require("debug")("app:startup");
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
const { logger, sentryLogger } = require("./startup/logging");
const emailService = require("./services/nodemailerEmailService");
const httpsRedirect = require('./middleware/httpsRedirect');

//Initialize Services that need initialization
sentryLogger.init();
emailService.init();

if (!config.get("jwtPrivateKey")) {
  sentryLogger.log("FATAL ERROR: jwtPrivateKey is not defined.");
  logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

// hook morganBody to express app
app.use(morgan("combined"));
morgan(app, { logAllReqHeader: true, maxBodyLength: 5000 });

const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;
app.use(httpsRedirect(httpsPort));

if (process.env.NODE_ENV === "production") {
  require("./startup/prod")(app);
}

require("./startup/routes")(app);
require("./startup/db")();

let options = {};
try {
  options = {
    key: fs.readFileSync("/run/secrets/api_selfsigned.key", { encoding: "utf-8" }),
    cert: fs.readFileSync("/run/secrets/api_selfsigned.crt", { encoding: "utf-8" }),
    enableTrace: false,
  };
} catch (err) {
  sentryLogger.log(`FATAL ERROR: FATAL ERROR: could not config ssl for the app. ${JSON.stringify(err)}`);
  logger.error(`FATAL ERROR: FATAL ERROR: could not config ssl for the app. ${JSON.stringify(err)}`);

  if (process.env.NODE_ENV === 'production')
    process.exit(1);
}


httpServer = http.createServer(app).listen(port, "0.0.0.0", true, () => logger.info(`Listening on port ${port}...`));
httpsServer = https.createServer(options, app).listen(httpsPort, "0.0.0.0", true, () => logger.info(`Listening on https port ${httpsPort}...`));

module.exports = { httpServer, httpsServer };
