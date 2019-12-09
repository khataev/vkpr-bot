const axios = require("axios");

const gLogger = require("./logger"); // TODO: get from context
const gSettings = require("./config");
const models = require("../db/models");
const CoinTransaction = models.CoinTransaction;
const Account = models.Account;
const ExchangeRate = models.ExchangeRate;
const AggregatedInfo = models.AggregatedInfo;

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

      CoinTransaction.sequelize.transaction({}, async transaction => {
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
  //   const filter = { vkId: vkId, isProcessed: true, isChecked: false };
  //   const transactions = await RubTransaction.findAll({
  //     where: filter
  //   });

  //   const totalIncome = transactions.reduce(
  //     (acc, tr) => acc + tr.hookInfo.payment.sum.amount,
  //     0 // initial value of acc
  //   );

  //   const txnIds = transactions.reduce(
  //     (acc, tr) => {
  //       acc.push(tr.hookInfo.payment.txnId);
  //       return acc;
  //     },
  //     [] // initial value of acc
  //   );

  //   await RubTransaction.update({ isChecked: true }, { where: filter });

  //   return [txnIds, totalIncome];
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
      await axios.post(url, params);

      AggregatedInfo.sequelize.transaction({}, async transaction => {
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

  async exchangeCoinsToRub(account) {
    const rate = await ExchangeRate.findOne({
      limit: 1,
      order: [["id", "DESC"]]
    });

    const coinAmount = account.coinAmount;
    // TODO: floor
    const rubs = Math.round(
      (account.coinAmount / rate.coinAmount) * rate.buyRate
    );

    AggregatedInfo.sequelize.transaction({}, async transaction => {
      await account.increment({
        coinAmount: -account.coinAmount,
        rubAmount: rubs
      });
      await AggregatedInfo.increment(
        { coinsExchanged: coinAmount },
        { where: {}, transaction: transaction }
      );
    });
    // HINT: copecks to rub (we should do it in specific standalone function)
    return rubs / 100;
  }
}

module.exports = CoinFinances;
