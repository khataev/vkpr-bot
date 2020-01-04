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
  // eslint-disable-next-line no-unused-vars
  Account.associate = function associate(models) {
    // associations can be defined here
  };
  // В рублях
  Account.prototype.rubAmountInRub = function rubAmountInRub() {
    return this.rubAmount / 100;
  };

  // В целых коинах
  Account.prototype.coinAmountInCoin = function coinAmountInCoin() {
    return this.coinAmount / 1000;
  };

  return Account;
};
