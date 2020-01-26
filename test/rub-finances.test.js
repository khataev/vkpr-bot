// TODO: refactor
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let mock;
const settings = require('@modules/config');

const { describe, it } = require('mocha');
const { expect } = require('chai');
const { Account, AggregatedInfo, ExchangeTransaction, ExchangeRate } = require('@models');
const rubFinances = require('@modules/rub-finances');

describe('Rub Finances', function() {
  describe('withdrawRub', function() {
    let account;
    let url;

    async function setup() {
      mock = new MockAdapter(axios);
      url = settings.get('credentials.qiwi.withdraw_url');
      await AggregatedInfo.create({});
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    }
    async function cleanup() {
      await AggregatedInfo.destroy({ where: {}, truncate: true });
      await Account.destroy({ where: {}, truncate: true });

      mock.restore();
    }

    // eslint-disable-next-line no-undef
    beforeEach(setup);
    // eslint-disable-next-line no-undef
    afterEach(cleanup);

    it('successful', async function() {
      mock.onPost(url).reply(200, {});
      const result = await rubFinances.withdrawRub(account);
      await account.reload();
      expect(result).to.be.equal(true);
      expect(account.rubAmount).to.be.equal(0);
    });

    it('error', async function() {
      mock.onPost(url).reply(422, {});
      const result = await rubFinances.withdrawRub(account);
      await account.reload();
      expect(result).to.be.equal(false);
      expect(account.rubAmount).to.be.equal(100);
    });
  });

  describe('exchangeRubToCoins', function() {
    let account;

    async function setup() {
      await AggregatedInfo.create({});
      await ExchangeRate.setExchangeRate(100, 50);
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    }
    async function cleanup() {
      await AggregatedInfo.destroy({
        where: {},
        truncate: true
      });
      await Account.destroy({
        where: {},
        truncate: true
      });
      await ExchangeTransaction.destroy({
        where: {},
        truncate: true
      });
      await ExchangeRate.destroy({
        where: {},
        truncate: true
      });
    }

    // eslint-disable-next-line no-undef
    beforeEach(setup);
    // eslint-disable-next-line no-undef
    afterEach(cleanup);

    it('successful', async () => {
      const result = await rubFinances.exchangeRubToCoins(account);
      await account.reload();
      expect(result).to.be.equal(1000000);
      expect(account.rubAmount).to.be.equal(0);
      expect(account.coinAmount).to.be.equal('3000000000');
    });
  });
});
