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
  sequelizeOptions.logging = console.log;
} else {
  sequelizeOptions.logging = false;
}
const sequelize = new Sequelize(config, sequelizeOptions);

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
