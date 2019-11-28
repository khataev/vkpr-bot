"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      vkId: { field: "vk_id", type: DataTypes.INTEGER },
      coinAmount: { field: "coin_amount", type: DataTypes.BIGINT },
      rubAmount: { field: "rub_amount", type: DataTypes.INTEGER },
      isSubscribed: { field: "is_subscribed", type: DataTypes.BOOLEAN }
    },
    {}
  );
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};
