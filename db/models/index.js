"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const settings = require("./../../modules/config");
const config = require("./../../config/database")[env];
const db = {};

const log_level = settings.get("debug.log_level");
let sequelizeOptions = {};
if (log_level == "debug") {
  console.log("Sequelize logging is ON");
  sequelizeOptions.logging = console.log;
} else {
  console.log("Sequelize logging is OFF");
  sequelizeOptions.logging = false;
}
let sequelize;
if (process.env.NODE_ENV === "production")
  sequelize = new Sequelize(config, sequelizeOptions);
else sequelize = new Sequelize(config);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
