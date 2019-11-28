'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AggregatedInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      users: {
        type: Sequelize.INTEGER
      },
      payments: {
        type: Sequelize.INTEGER
      },
      coins_deposited: {
        type: Sequelize.BIGINT
      },
      rub_deposited: {
        type: Sequelize.INTEGER
      },
      coins_exchanged: {
        type: Sequelize.BIGINT
      },
      rub_exchanged: {
        type: Sequelize.INTEGER
      },
      coins_withdrawed: {
        type: Sequelize.BIGINT
      },
      rub_withdrawed: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('AggregatedInfos');
  }
};