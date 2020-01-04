const axios = require("axios");

const constants = require("./constants");
const settings = require("./config");
const balanceManager = require("./balance-manager");
const {
  Account,
  AggregatedInfo,
  CoinTransaction,
  ExchangeRate,
  ExchangeTransaction
} = require("../db/models");

class CoinFinances {
  getVkCoinPaymentUrl() {
    const baseUrl = settings.get("credentials.vk_coin.payment_url");
    const accountNumber = settings.get("credentials.vk_coin.account_number");
    const max = 2000000000;
    const min = -2000000000;
    const randomNumber = Math.round(Math.random() * (max - min) + min);

    return `${baseUrl}#x${accountNumber}_1000_${randomNumber}_1`;
  }

  async processWebHook(hookInfo) {
    try {
      const { id: txnId, amount, from_id: vkId } = hookInfo;

      await CoinTransaction.create({
        vkId,
        txnId,
        hookInfo,
        isChecked: true // HINT: пока нет функционала проверки платежа
      });

      await CoinTransaction.sequelize.transaction({}, async transaction => {
        await CoinTransaction.update(
          {
            isProcessed: true
          },
          { where: { txnId }, transaction }
        );

        await Account.increment({ coinAmount: amount }, { where: { vkId }, transaction });

        await AggregatedInfo.increment(
          { payments: 1, coinsDeposited: amount },
          { where: {}, transaction }
        );
      });

      return true;
    } catch (error) {
      console.error(`COIN webhook handler error. ${error.message}`);

      return false;
    }
  }

  // async checkIncomePayment(vkId) {
  // }

  async withdrawCoin(account) {
    const url = settings.get("credentials.vk_coin.withdraw_url");
    const accessToken = settings.get("credentials.vk_coin.access_token");
    const merchantId = settings.get("credentials.vk_coin.account_number");
    const amount = account.coinAmount;
    const params = {
      merchantId,
      key: accessToken,
      toId: account.vkId,
      amount: account.coinAmount
    };

    try {
      const response = await axios.post(url, params);
      if (response.data && response.data.error) {
        // eslint-disable-next-line prefer-destructuring
        const code = response.data.error.code;
        // eslint-disable-next-line prefer-destructuring
        const message = response.data.error.message;
        throw new Error(`code: ${code}, message: ${message}`);
      }

      await AggregatedInfo.sequelize.transaction({}, async transaction => {
        await account.update({ coinAmount: 0 }, { transaction });
        await AggregatedInfo.increment({ coinsWithdrawed: amount }, { where: {}, transaction });
      });

      return true;
    } catch (error) {
      console.error(error.message);

      return false;
    }
  }

  coinToRub(coinAmount, rate) {
    return Math.floor((coinAmount / rate.coinAmount) * rate.buyRate);
  }

  async isEnoughRubForExchange(account) {
    return true; // TODO

    // eslint-disable-next-line no-unreachable
    const rate = await ExchangeRate.currentRate();
    const rubBalance = await balanceManager.getRubBalance();
    const rubs = this.coinToRub(account.coinAmount, rate);

    return rubBalance >= rubs;
  }

  async exchangeCoinsToRub(account) {
    const rate = await ExchangeRate.currentRate();
    const { coinAmount } = account;
    const rubs = this.coinToRub(account.coinAmount, rate);

    await AggregatedInfo.sequelize.transaction({}, async transaction => {
      await account.increment({
        coinAmount: -account.coinAmount,
        rubAmount: rubs
      });
      await AggregatedInfo.increment({ coinsExchanged: coinAmount }, { where: {}, transaction });
      await ExchangeTransaction.create(
        {
          vkId: account.vkId,
          type: constants.EXCHANGE_SELL_COIN,
          rate: rate.buyRate,
          rubAmount: rubs,
          coinAmount
        },
        { transaction }
      );
    });
    // HINT: copecks to rub (we should do it in specific standalone function)
    return rubs / 100;
  }
}

module.exports = new CoinFinances();
