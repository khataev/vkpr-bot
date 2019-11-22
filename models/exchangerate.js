'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    date: DataTypes.DATE,
    coin_amount: DataTypes.BIGINT,
    sell_rate: DataTypes.INTEGER,
    buy_rate: DataTypes.INTEGER
  }, {});
  ExchangeRate.associate = function(models) {
    // associations can be defined here
  };
  return ExchangeRate;
};