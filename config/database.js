const config = require("../modules/config");
const logLevel = config.get("debug.log_level");
const logging = logLevel === "debug" ? console.log : false;

module.exports = {
  development: {
    username: config.get("db.username"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    host: config.get("db.host"),
    dialect: config.get("db.dialect"),
    logging: logging
  },
  test: {
    username: config.get("db.username"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    host: config.get("db.host"),
    dialect: config.get("db.dialect"),
    logging: logging
  },
  // TODO: logging here
  production: config.get("db.url")
};
