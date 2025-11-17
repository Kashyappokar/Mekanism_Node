const { format, createLogger, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      return `${info.timestamp} [${info.level}] "${info.message}"`;
    })
  ),
  transports: [new transports.File({ filename: "logger.log" })],
});

module.exports = logger;