import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn: "https://5b794d2be47c4b368a1d203c7abb0438@o1237225.ingest.sentry.io/6387561",
    integrations: [new BrowserTracing()],
    release: "1.0.0",
    environment: "development",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
