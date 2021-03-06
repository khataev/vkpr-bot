"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Accounts", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        vk_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        coin_amount: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        rub_amount: {
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
        queryInterface.addIndex("Accounts", { unique: true, fields: ["vk_id"] })
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Accounts");
  }
};
