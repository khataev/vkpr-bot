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
  return Account;
};
