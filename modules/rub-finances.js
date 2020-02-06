const qs = require('qs');
const axios = require('axios');

const constants = require('./constants');
const settings = require('./config');
const utils = require('./utils');
const balanceManager = require('./balance-manager');
const {
  Account,
  AggregatedInfo,
  ExchangeRate,
  ExchangeTransaction,
  RubTransaction
} = require('./../db/models');

class RubFinances {
  getQiwiPaymentUrl(userId) {
    const baseUrl = settings.get('credentials.qiwi.payment_url');
    const accountNumber = settings.get('credentials.qiwi.account_number');

    const params = qs.stringify({
      currency: 'RUB',
      amountFraction: 0,
      extra: { "'comment'": userId, "'account'": accountNumber },
      amountInteger: 5,
      blocked: ['comment', 'account']
    });

    return `${baseUrl}?${params}`;
  }

  getShortQiwiPaymentUrl(userId) {
    const url = this.getQiwiPaymentUrl(userId);
    return utils.shortenUrl(url);
  }

  async processWebHook(hookInfo) {
    const { test } = hookInfo;
    if (test) return true;

    try {
      const {
        payment: {
          type,
          status,
          txnId,
          comment: vkId,
          sum: { amount, currency }
        }
      } = hookInfo;

      if (type !== 'IN') return true;

      await RubTransaction.create({ vkId, txnId, hookInfo });

      if (status === 'SUCCESS' && currency === 643) {
        await RubTransaction.sequelize.transaction({}, async transaction => {
          await RubTransaction.update(
            {
              isProcessed: true
            },
            { where: { txnId }, transaction }
          );

          await Account.increment(
            { rubAmount: Math.floor(amount * 100) },
            { where: { vkId }, transaction }
          );

          await AggregatedInfo.increment(
            { payments: 1, rubDeposited: amount * 100 },
            { where: {}, transaction }
          );
        });
      }

      return true;
    } catch (error) {
      console.error(`RUB webhook handler error. ${error.message}`);

      return false;
    }
  }

  async checkIncomePayment(vkId) {
    const filter = { vkId, isProcessed: true, isChecked: false };
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
    const url = settings.get('credentials.qiwi.withdraw_url');
    const accessToken = settings.get('credentials.qiwi.access_token');
    const transactionId = new Date().getTime();
    const comment = 'Выплата VK Coin Биржа https://vk.com/club189652443';
    const amount = account.rubAmount;
    const params = {
      id: transactionId.toString(),
      sum: { amount: account.rubAmountInRub(), currency: '643' },
      paymentMethod: {
        type: 'Account',
        accountId: '643'
      },
      comment,
      fields: { account: `+${destinationPhoneNumber}` }
    };

    try {
      await axios.post(url, params, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      await AggregatedInfo.sequelize.transaction({}, async transaction => {
        await account.update({ rubAmount: 0 }, { transaction });
        await AggregatedInfo.increment({ rubWithdrawed: amount }, { where: {}, transaction });
      });

      return true;
    } catch (error) {
      console.error(error.message);

      return false;
    }
  }

  rubToCoins(rubAmount, rate) {
    return Math.floor((rubAmount / rate.sellRate) * rate.coinAmount);
  }

  rubToCoinsReserve(rubAmount, rate) {
    return Math.floor((rubAmount / rate.buyRate) * rate.coinAmount);
  }

  async isEnoughCoinForExchange(account) {
    return true; // TODO

    // eslint-disable-next-line no-unreachable
    const rate = await ExchangeRate.currentRate();
    const coinBalance = await balanceManager.getCoinBalance();
    const coins = this.rubToCoins(account.rubAmount, rate);

    return coinBalance >= coins;
  }

  async exchangeRubToCoins(account) {
    const rate = await ExchangeRate.currentRate();

    const { rubAmount } = account;
    const coins = this.rubToCoins(rubAmount, rate);

    await AggregatedInfo.sequelize.transaction({}, async transaction => {
      await account.increment({
        rubAmount: -account.rubAmount,
        coinAmount: coins
      });
      await AggregatedInfo.increment({ rubExchanged: rubAmount }, { where: {}, transaction });
      await ExchangeTransaction.create(
        {
          vkId: account.vkId,
          type: constants.EXCHANGE_BUY_COIN,
          rate: rate.sellRate,
          rubAmount,
          coinAmount: coins
        },
        { transaction }
      );
    });
    // HINT: coin copecks to whole coins
    return coins / 1000;
  }
}

module.exports = new RubFinances();
