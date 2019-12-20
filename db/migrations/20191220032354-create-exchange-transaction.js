"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("ExchangeTransactions", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        vk_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        rate: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        rub_amount: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        coin_amount: {
          type: Sequelize.BIGINT,
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
      })
      .then(() =>
        queryInterface.addIndex("ExchangeTransactions", {
          fields: ["vk_id", "date"]
        })
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ExchangeTransactions");
  }
};
