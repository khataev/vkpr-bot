"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Accounts", "is_subscribed", {
      type: Sequelize.BOOLEAN
    });
    return queryInterface.addIndex("Accounts", {
      fields: ["is_subscribed"]
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Accounts", "is_subscribed");
  }
};
