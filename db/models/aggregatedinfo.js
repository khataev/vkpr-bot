'use strict';
module.exports = (sequelize, DataTypes) => {
  const AggregatedInfo = sequelize.define('AggregatedInfo', {
    users: DataTypes.INTEGER,
    payments: DataTypes.INTEGER,
    coins_deposited: DataTypes.BIGINT,
    rub_deposited: DataTypes.INTEGER,
    coins_exchanged: DataTypes.BIGINT,
    rub_exchanged: DataTypes.INTEGER,
    coins_withdrawed: DataTypes.BIGINT,
    rub_withdrawed: DataTypes.INTEGER
  }, {});
  AggregatedInfo.associate = function(models) {
    // associations can be defined here
  };
  return AggregatedInfo;
};