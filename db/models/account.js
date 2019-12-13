"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      vkId: { field: "vk_id", type: DataTypes.INTEGER },
      coinAmount: {
        field: "coin_amount",
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      // В копейках
      rubAmount: {
        field: "rub_amount",
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isSubscribed: {
        field: "is_subscribed",
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  Account.associate = function(models) {
    // associations can be defined here
  };
  // В рублях
  Account.prototype.rubAmountInRub = function() {
    return this.rubAmount / 100;
  };

  // В целых коинах
  Account.prototype.coinAmountInCoin = function() {
    return this.coinAmount / 1000;
  };

  return Account;
};
