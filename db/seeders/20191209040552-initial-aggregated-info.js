"use strict";
const models = require("./../models");
const AggregatedInfo = models.AggregatedInfo;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return AggregatedInfo.create({});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("AggregatedInfos", null, {});
  }
};
