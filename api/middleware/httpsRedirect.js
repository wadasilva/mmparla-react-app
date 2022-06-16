const { logger, sentryLogger } = require("../startup/logging");

module.exports = function(httpsPort) {
  return function (req, res, next) {
    if (process.env.NODE_ENV === "production") {
      if (req.headers["x-forwarded-proto"] !== "https") {
        let url = `https://${req.headers.host}${req.url}`;
        const port = req.headers.host.split(':')[1];
        url = url.replace(port, httpsPort);
        logger.info(url);
        return res.redirect(url);
      }
        
    }
    return next();
  }
};
