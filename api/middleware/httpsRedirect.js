const { logger, sentryLogger } = require("../startup/logging");

module.exports = function(httpsPort) {
  return function (req, res, next) {
    try {
      if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
        if (!req.connection.encrypted) {
          let url = `https://${req.headers.host}${req.url}`;
          const port = req.headers.host.split(':')[1];
          url = url.replace(port, httpsPort);
          return res.redirect(url);
        }          
      }
      return next();
    } catch (error) {
      logger.error(JSON.stringify(error));
      sentryLogger.log(error);
      return res.status(500).send('Internal server error');
    }
  }
};
