"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("ExchangeRates", {
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
        coin_amount: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        sell_rate: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        buy_rate: {
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
      })
      .then(() =>
        queryInterface.addIndex("ExchangeRates", {
          unique: true,
          fields: ["date"]
        })
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ExchangeRates");
  }
};
