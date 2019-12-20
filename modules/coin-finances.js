const axios = require("axios");

const constants = require("./constants");
const gLogger = require("./logger"); // TODO: get from context
const gSettings = require("./config");
const models = require("../db/models");
const CoinTransaction = models.CoinTransaction;
const Account = models.Account;
const ExchangeRate = models.ExchangeRate;
const AggregatedInfo = models.AggregatedInfo;
const ExchangeTransaction = models.ExchangeTransaction;
const BalanceManager = require("./balance-manager");
const balanceManager = new BalanceManager(null);

class CoinFinances {
  constructor(logger) {
    this.logger = logger || gLogger;
  }

  getVkCoinPaymentUrl() {
    const baseUrl = gSettings.get("credentials.vk_coin.payment_url");
    const accountNumber = gSettings.get("credentials.vk_coin.account_number");
    const max = 2000000000;
    const min = -2000000000;
    const randomNumber = Math.round(Math.random() * (max - min) + min);

    return `${baseUrl}#x${accountNumber}_1000_${randomNumber}_1`;
  }

  async processWebHook(hookInfo) {
    try {
      const { id: txnId, amount, from_id: vkId } = hookInfo;

      await CoinTransaction.create({
        vkId: vkId,
        txnId: txnId,
        hookInfo: hookInfo,
        isChecked: true // HINT: пока нет функционала проверки платежа
      });

      await CoinTransaction.sequelize.transaction({}, async transaction => {
        await CoinTransaction.update(
          {
            isProcessed: true
          },
          { where: { txnId: txnId }, transaction: transaction }
        );

        await Account.increment(
          { coinAmount: amount },
          { where: { vkId: vkId }, transaction: transaction }
        );

        await AggregatedInfo.increment(
          { payments: 1, coinsDeposited: amount },
          { where: {}, transaction: transaction }
        );
      });

      return true;
    } catch (error) {
      this.logger.error(`COIN webhook handler error. ${error.message}`);

      return false;
    }
  }

  // async checkIncomePayment(vkId) {
  // }

  async withdrawCoin(account) {
    const url = gSettings.get("credentials.vk_coin.withdraw_url");
    const accessToken = gSettings.get("credentials.vk_coin.access_token");
    const merchantId = gSettings.get("credentials.vk_coin.account_number");
    const amount = account.coinAmount;
    const params = {
      merchantId: merchantId,
      key: accessToken,
      toId: account.vkId,
      amount: account.coinAmount
    };

    try {
      const response = await axios.post(url, params);
      if (response.data && response.data.error) {
        const code = response.data.error.code;
        const message = response.data.error.message;
        throw new Error(`code: ${code}, message: ${message}`);
      }

      await AggregatedInfo.sequelize.transaction({}, async transaction => {
        await account.update({ coinAmount: 0 }, { transaction: transaction });
        await AggregatedInfo.increment(
          { coinsWithdrawed: amount },
          { where: {}, transaction: transaction }
        );
      });

      return true;
    } catch (error) {
      console.error(error.message);

      return false;
    }
  }

  async isEnoughRubForExchange(account) {
    return true; // TODO

    const rate = await ExchangeRate.currentRate();
    const rubBalance = await balanceManager.getRubBalance();
    // TODO: Sync this with function exchangeCoinsToRub or refactor
    const rubs = Math.floor(
      (account.coinAmount / rate.coinAmount) * rate.buyRate
    );

    return rubBalance >= rubs;
  }

  async exchangeCoinsToRub(account) {
    const rate = await ExchangeRate.currentRate();
    const coinAmount = account.coinAmount;
    const rubs = Math.floor(
      (account.coinAmount / rate.coinAmount) * rate.buyRate
    );

    await AggregatedInfo.sequelize.transaction({}, async transaction => {
      await account.increment({
        coinAmount: -account.coinAmount,
        rubAmount: rubs
      });
      await AggregatedInfo.increment(
        { coinsExchanged: coinAmount },
        { where: {}, transaction: transaction }
      );
      await ExchangeTransaction.create(
        {
          vkId: account.vkId,
          type: constants.EXCHANGE_SELL_COIN,
          rate: rate.buyRate,
          rubAmount: rubs,
          coinAmount: coinAmount
        },
        { transaction: transaction }
      );
    });
    // HINT: copecks to rub (we should do it in specific standalone function)
    return rubs / 100;
  }
}

module.exports = CoinFinances;
