// TODO: refactor
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
let mock;
const settings = require("@modules/config");

const { describe, it } = require("mocha");
const { expect } = require("chai");
const {
  Account,
  AggregatedInfo,
  ExchangeTransaction,
  ExchangeRate
} = require("@models");
const rubFinances = require("@modules/rub-finances");

describe("Rub Finances", function() {
  describe("withdrawRub", async function() {
    let account;
    let url;

    const setup = async function() {
      mock = new MockAdapter(axios);
      url = settings.get("credentials.qiwi.withdraw_url");
      await AggregatedInfo.create({});
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    };
    const cleanup = async function() {
      await AggregatedInfo.destroy({ where: {}, truncate: true });
      await Account.destroy({ where: {}, truncate: true });

      mock.restore();
    };

    beforeEach(setup);
    afterEach(cleanup);

    it("successful", async function() {
      mock.onPost(url).reply(200, {});
      const result = await rubFinances.withdrawRub(account);
      await account.reload();
      expect(result).to.be.equal(true);
      expect(account.rubAmount).to.be.equal(0);
    });

    it("error", async function() {
      mock.onPost(url).reply(422, {});
      const result = await rubFinances.withdrawRub(account);
      await account.reload();
      expect(result).to.be.equal(false);
      expect(account.rubAmount).to.be.equal(100);
    });
  });

  describe("exchangeRubToCoins", function() {
    let account;

    const setup = async function() {
      await AggregatedInfo.create({});
      await ExchangeRate.setExchangeRate(100, 50);
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    };
    const cleanup = async function() {
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
    };

    beforeEach(setup);
    afterEach(cleanup);

    it("successful", async () => {
      const result = await rubFinances.exchangeRubToCoins(account);
      await account.reload();
      expect(result).to.be.equal(1000000);
      expect(account.rubAmount).to.be.equal(0);
      expect(account.coinAmount).to.be.equal("3000000000");
    });
  });
});
