const qs = require("qs");
const axios = require("axios");

const constants = require("./constants");
const gLogger = require("./logger"); // TODO: get from context
const gSettings = require("./config");
const models = require("./../db/models");
const utils = require("./utils");
const RubTransaction = models.RubTransaction;
const Account = models.Account;
const ExchangeRate = models.ExchangeRate;
const AggregatedInfo = models.AggregatedInfo;
const ExchangeTransaction = models.ExchangeTransaction;
const BalanceManager = require("./balance-manager");
const balanceManager = new BalanceManager(null);

class RubFinances {
  constructor(logger) {
    this.logger = logger || gLogger;
  }

  getQiwiPaymentUrl(userId) {
    const baseUrl = gSettings.get("credentials.qiwi.payment_url");
    const accountNumber = gSettings.get("credentials.qiwi.account_number");

    const params = qs.stringify({
      currency: "RUB",
      amountFraction: 0,
      extra: { "'comment'": userId, "'account'": accountNumber },
      amountInteger: 5,
      blocked: ["comment", "account"]
    });

    return `${baseUrl}?${params}`;
  }

  async getShortQiwiPaymentUrl(userId) {
    const url = this.getQiwiPaymentUrl(userId);
    return await utils.shortenUrl(url);
  }

  async processWebHook(hookInfo) {
    const { test } = hookInfo;
    if (test) {
      return true;
    } else {
      try {
        const {
          payment: {
            type,
            status,
            txnId,
            comment: vkId,
            sum: { amount }
          }
        } = hookInfo;

        if (type !== "IN") return;

        await RubTransaction.create({
          vkId: vkId,
          txnId: txnId,
          hookInfo: hookInfo
        });

        if (status === "SUCCESS") {
          await RubTransaction.sequelize.transaction({}, async transaction => {
            await RubTransaction.update(
              {
                isProcessed: true
              },
              { where: { txnId: txnId }, transaction: transaction }
            );

            await Account.increment(
              { rubAmount: Math.floor(amount * 100) },
              { where: { vkId: vkId }, transaction: transaction }
            );

            await AggregatedInfo.increment(
              { payments: 1, rubDeposited: amount * 100 },
              { where: {}, transaction: transaction }
            );
          });
        }

        return true;
      } catch (error) {
        this.logger.error(`RUB webhook handler error. ${error.message}`);

        return false;
      }
    }
  }

  async checkIncomePayment(vkId) {
    const filter = { vkId: vkId, isProcessed: true, isChecked: false };
    const transactions = await RubTransaction.findAll({
      where: filter
    });

    const totalIncome = transactions.reduce(
      (acc, tr) => acc + tr.hookInfo.payment.sum.amount,
      0 // initial value of acc
    );

    const txnIds = transactions.reduce(
      (acc, tr) => {
        acc.push(tr.hookInfo.payment.txnId);
        return acc;
      },
      [] // initial value of acc
    );

    await RubTransaction.update({ isChecked: true }, { where: filter });

    return [txnIds, totalIncome];
  }

  async withdrawRub(account, destinationPhoneNumber) {
    const url = gSettings.get("credentials.qiwi.withdraw_url");
    const accessToken = gSettings.get("credentials.qiwi.access_token");
    const transactionId = new Date().getTime();
    const comment = "Выплата ТестБотОбменник";
    const amount = account.rubAmount;
    const params = {
      id: transactionId.toString(),
      sum: { amount: account.rubAmountInRub(), currency: "643" },
      paymentMethod: {
        type: "Account",
        accountId: "643"
      },
      comment: comment,
      fields: { account: `+${destinationPhoneNumber}` }
    };

    try {
      await axios.post(url, params, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      await AggregatedInfo.sequelize.transaction({}, async transaction => {
        await account.update({ rubAmount: 0 }, { transaction: transaction });
        await AggregatedInfo.increment(
          { rubWithdrawed: amount },
          { where: {}, transaction: transaction }
        );
      });

      return true;
    } catch (error) {
      console.error(error.message);

      return false;
    }
  }

  async isEnoughCoinForExchange(account) {
    return true; // TODO

    const rate = await ExchangeRate.currentRate();
    const coinBalance = await balanceManager.getCoinBalance();
    // TODO: Sync this with function exchangeRubToCoins or refactor
    const coins = Math.floor(
      (account.rubAmount / rate.sellRate) * rate.coinAmount
    );

    return coinBalance >= coins;
  }

  async exchangeRubToCoins(account) {
    const rate = await ExchangeRate.currentRate();

    const rubAmount = account.rubAmount;
    const coins = Math.floor(
      (account.rubAmount / rate.sellRate) * rate.coinAmount
    );

    await AggregatedInfo.sequelize.transaction({}, async transaction => {
      await account.increment({
        rubAmount: -account.rubAmount,
        coinAmount: coins
      });
      await AggregatedInfo.increment(
        { rubExchanged: rubAmount },
        { where: {}, transaction: transaction }
      );
      await ExchangeTransaction.create(
        {
          vkId: account.vkId,
          type: constants.EXCHANGE_BUY_COIN,
          rate: rate.sellRate,
          rubAmount: rubAmount,
          coinAmount: coins
        },
        { transaction: transaction }
      );
    });
    // HINT: coin copecks to whole coins
    return coins / 1000;
  }
}

module.exports = RubFinances;
