"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("RubTransactions", "is_processed", {
      type: Sequelize.BOOLEAN,
      allowNull: false
    });
    return queryInterface.addIndex("RubTransactions", {
      fields: ["is_processed"]
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("RubTransactions", "is_processed");
  }
};
