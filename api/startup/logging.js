
const moment = require('moment');
const { createLogger, format, transports, config: winstonConfig } = require('winston');
const { combine, timestamp, prettyPrint, colorize, simple, label } = format;
const config = require('config');

const consoleFormat = format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message} \n${info.stack}`
});

const logger = createLogger({
    levels: winstonConfig.npm.levels,
    transports: [
        new transports.Console({
            level: 'silly',
            format: combine(
                label({ label: '[LOGGER]' }),
                timestamp(),
                simple(),
                format.printf(info => colorize().colorize(info.level, `${info.label} ${info.level}: ${info.timestamp} ${info.message} \n${info.stack}`))
            ),
        }),
        new transports.File({
            level: 'warn',
            filename: `${config.get('paths.logs')}logfile.log`,
            format: combine(
                timestamp(),
                prettyPrint()
            ),
        })
    ]
});

module.exports = logger;

