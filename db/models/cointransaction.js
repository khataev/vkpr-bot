"use strict";
module.exports = (sequelize, DataTypes) => {
  const CoinTransaction = sequelize.define(
    "CoinTransaction",
    {
      vkId: { field: "vk_id", type: DataTypes.INTEGER },
      txnId: { field: "txn_id", type: DataTypes.STRING },
      hookInfo: { field: "hook_info", type: DataTypes.JSONB, defaultValue: {} },
      isChecked: {
        field: "is_checked",
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isProcessed: {
        field: "is_processed",
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  CoinTransaction.associate = function(models) {
    // associations can be defined here
  };
  return CoinTransaction;
};
