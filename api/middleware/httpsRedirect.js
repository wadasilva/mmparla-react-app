const { logger, sentryLogger } = require("../startup/logging");

module.exports = function (req, res, next) {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      const url = `https://${req.headers.host}${req.url}`;
      location.log(url);
      return res.redirect(url);
    }
      
  }
  return next();
};
