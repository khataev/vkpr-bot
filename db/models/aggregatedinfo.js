module.exports = (sequelize, DataTypes) => {
  const AggregatedInfo = sequelize.define(
    'AggregatedInfo',
    {
      users: { type: DataTypes.INTEGER, defaultValue: 0 },
      payments: { type: DataTypes.INTEGER, defaultValue: 0 },
      coinsDeposited: {
        field: 'coins_deposited',
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      rubDeposited: {
        field: 'rub_deposited',
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      coinsExchanged: {
        field: 'coins_exchanged',
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      rubExchanged: {
        field: 'rub_exchanged',
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      coinsWithdrawed: {
        field: 'coins_withdrawed',
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      rubWithdrawed: {
        field: 'rub_withdrawed',
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  AggregatedInfo.associate = function associate(models) {
    // associations can be defined here
  };
  return AggregatedInfo;
};
