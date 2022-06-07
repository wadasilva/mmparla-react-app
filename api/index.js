const config = require("config-secrets");
require("./startup/folders")();
const starttupDebugger = require("debug")("app:startup");
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const morgan = require("morgan");
const { logger, sentryLogger } = require("./startup/logging");
const emailService = require("./services/nodemailerEmailService");

if (!config.get("jwtPrivateKey")) {
  sentryLogger.log("FATAL ERROR: jwtPrivateKey is not defined.");
  logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

// hook morganBody to express app
app.use(morgan("combined"));
morgan(app, { logAllReqHeader: true, maxBodyLength: 5000 });

require("./startup/routes")(app);
require("./startup/db")();

if (process.env.NODE_ENV === "production") {
  require("./startup/prod")(app);
}

//Initialize Services that need initialization
sentryLogger.init();
emailService.init();

const port = process.env.PORT || 3000;
const server = app.listen(port, "0.0.0.0", true, () =>
  console.log(`Listening on port ${port}...`)
);
// const server = https.createServer({
//     key: fs.readFileSync('selfsigned.key'),
//     cert: fs.readFileSync('selfsigned.pem'),
//     enableTrace: true
// }, app).listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}...`));

module.exports = server;
