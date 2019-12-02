"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("RubTransactions", {
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
          type: Sequelize.STRING
        },
        hook_info: {
          type: Sequelize.JSONB,
          allowNull: false
        },
        checked: {
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
      })
      .then(() =>
        queryInterface.addIndex("RubTransactions", {
          unique: false,
          fields: ["vk_id", "checked"]
        })
      )
      .then(() =>
        queryInterface.addIndex("RubTransactions", {
          unique: true,
          fields: ["txn_id"]
        })
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("RubTransaction");
  }
};
