const fs = require('fs');
const path = require('path');
const config = require('config');

module.exports = () => {

    //Creates temp directory
    Object.keys(config.get('paths')).forEach(key => {
        try {
            let path = config.get(`paths.${key}`);
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        } catch (ex) {
            throw ex;
        }
    });
};