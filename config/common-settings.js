const settings = require("../modules/config");
const logLevel = settings.get("debug.log_level");
const logging = logLevel === "debug" ? console.log : false;
const url = settings.get("db.url");
const mainConfig = {
  username: settings.get("db.username"),
  password: settings.get("db.password"),
  database: settings.get("db.database"),
  host: settings.get("db.host"),
  dialect: settings.get("db.dialect"),
  logging
};

module.exports = {
  url,
  logging,
  mainConfig
};
