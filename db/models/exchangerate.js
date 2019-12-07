"use strict";
module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define(
    "ExchangeRate",
    {
      date: DataTypes.DATE,
      coinAmount: { field: "coin_amount", type: DataTypes.BIGINT },
      sellRate: { field: "sell_rate", type: DataTypes.INTEGER },
      buyRate: { field: "buy_rate", type: DataTypes.INTEGER }
    },
    {}
  );
  ExchangeRate.associate = function(models) {
    // associations can be defined here
  };
  return ExchangeRate;
};
