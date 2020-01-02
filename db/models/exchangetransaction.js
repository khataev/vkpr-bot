"use strict";
module.exports = (sequelize, DataTypes) => {
  const ExchangeTransaction = sequelize.define(
    "ExchangeTransaction",
    {
      date: { defaultValue: new Date(), type: DataTypes.DATE },
      vkId: { field: "vk_id", type: DataTypes.INTEGER },
      type: DataTypes.INTEGER,
      rate: DataTypes.INTEGER,
      rubAmount: { field: "rub_amount", type: DataTypes.INTEGER },
      coinAmount: { field: "coin_amount", type: DataTypes.BIGINT }
    },
    {}
  );
  ExchangeTransaction.associate = function(models) {
    // associations can be defined here
  };
  return ExchangeTransaction;
};
