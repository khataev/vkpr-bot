"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("AggregatedInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      users: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      payments: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      coins_deposited: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      rub_deposited: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      coins_exchanged: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      rub_exchanged: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      coins_withdrawed: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      rub_withdrawed: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable("AggregatedInfos");
  }
};
