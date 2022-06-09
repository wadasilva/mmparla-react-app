const { logger, sentryLogger } = require("../startup/logging");
const exphbs = require("handlebars");
const fs = require("fs/promises");

const templateDir = "./views/";

function compile(templateName, templateData = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = templateDir + templateName;
      const result = await fs.readFile(filePath, "utf8");
      const template = exphbs.compile(result.toString());
      const parsedTemplate = template(templateData);
      resolve(parsedTemplate);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

module.exports = {
  compile,
};
