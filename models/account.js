'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    vk_id: DataTypes.INTEGER,
    coin_amount: DataTypes.BIGINT,
    rub_amount: DataTypes.INTEGER
  }, {});
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};