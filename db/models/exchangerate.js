module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define(
    'ExchangeRate',
    {
      date: DataTypes.DATE,
      coinAmount: { field: 'coin_amount', type: DataTypes.BIGINT },
      sellRate: { field: 'sell_rate', type: DataTypes.INTEGER },
      buyRate: { field: 'buy_rate', type: DataTypes.INTEGER }
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  ExchangeRate.associate = function associate(models) {
    // associations can be defined here
  };

  ExchangeRate.currentRate = function currentRate() {
    return this.findOne({
      limit: 1,
      order: [['id', 'DESC']]
    });
  };

  ExchangeRate.setExchangeRate = async function setExchangeRate(
    sellRate,
    buyRate,
    date = new Date()
  ) {
    try {
      await ExchangeRate.sequelize.transaction({}, async transaction => {
        await ExchangeRate.destroy({ where: {}, transaction });
        await ExchangeRate.create(
          {
            coinAmount: 1000000000,
            sellRate,
            buyRate,
            date
          },
          { transaction }
        );
      });

      return true;
    } catch (error) {
      console.log(error.message);

      return false;
    }
  };

  return ExchangeRate;
};
