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

  ExchangeRate.currentRate = function() {
    return this.findOne({
      limit: 1,
      order: [["id", "DESC"]]
    });
  };

  ExchangeRate.setExchangeRate = async function(
    sellRate,
    buyRate,
    date = new Date()
  ) {
    try {
      // TODO: await??
      ExchangeRate.sequelize.transaction({}, async transaction => {
        await ExchangeRate.destroy({ where: {}, transaction: transaction });
        await ExchangeRate.create(
          {
            coinAmount: 1000000000,
            sellRate: sellRate,
            buyRate: buyRate,
            date: date
          },
          { transaction: transaction }
        );
        console.log("SET RATE 0");
      });

      console.log("SET RATE 1");
      return true;
    } catch (error) {
      console.log(error.message);

      return false;
    }
  };

  return ExchangeRate;
};
