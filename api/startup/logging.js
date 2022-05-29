//Winston logging

const moment = require("moment");
const {
  createLogger,
  format,
  transports,
  config: winstonConfig,
} = require("winston");
const { combine, timestamp, prettyPrint, colorize, simple, label } = format;
const config = require("config");

const consoleFormat = format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message} \n${info.stack}`;
});

const logger = createLogger({
  levels: winstonConfig.npm.levels,
  transports: [
    new transports.Console({
      level: "silly",
      format: combine(
        label({ label: "[LOGGER]" }),
        timestamp(),
        simple(),
        format.printf((info) =>
          colorize().colorize(
            info.level,
            `${info.label} ${info.level}: ${info.timestamp} ${info.message} \n${info.stack}`
          )
        )
      ),
    }),
    new transports.File({
      level: "warn",
      filename: `${config.get("paths.logs")}logfile.log`,
      format: combine(timestamp(), prettyPrint()),
    }),
  ],
});

//Sentry loggin
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

const sentryLogger = {
  init: () => {
    Sentry.init({
      dsn: "https://ca41d76386e24d4284383ba22e88aefd@o1237225.ingest.sentry.io/6443107",

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  },
  log: (error) => {
    Sentry.captureException(error);
  },
  finish: () => {
    transaction.finish();
  },
};

module.exports = {
  logger,
  sentryLogger,
};
