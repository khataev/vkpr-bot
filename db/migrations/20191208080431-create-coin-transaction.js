"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CoinTransactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vk_id: {
        type: Sequelize.INTEGER
      },
      txn_id: {
        type: Sequelize.INTEGER
      },
      hook_info: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      is_checked: {
        type: Sequelize.BOOLEAN
      },
      is_processed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CoinTransactions");
  }
};
