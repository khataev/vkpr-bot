// TODO: refactor
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const settings = require("@modules/config");

const { describe, it } = require("mocha");
const { expect } = require("chai");
const {
  Account,
  AggregatedInfo,
  ExchangeTransaction,
  ExchangeRate
} = require("@models");
const coinFinances = require("@modules/coin-finances");

describe("Coin Finances", function() {
  describe("withdrawCoin", async function() {
    let account;
    let url;

    const dbSetup = async function() {
      url = settings.get("credentials.vk_coin.withdraw_url");
      await AggregatedInfo.create({});
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    };
    const dbCleanup = async function() {
      await AggregatedInfo.destroy({ where: {}, truncate: true });
      await Account.destroy({ where: {}, truncate: true });

      mock.reset();
    };

    beforeEach(dbSetup);
    afterEach(dbCleanup);

    it("successful", async function() {
      mock.onPost(url).reply(200, {});
      const result = await coinFinances.withdrawCoin(account);
      await account.reload();
      expect(result).to.be.equal(true);
      expect(account.coinAmount).to.be.equal("0");
    });

    it("error", async function() {
      mock
        .onPost(url)
        .reply(200, { error: { code: "code", message: "message" } });
      const result = await coinFinances.withdrawCoin(account);
      await account.reload();
      expect(result).to.be.equal(false);
      expect(account.coinAmount).to.be.equal("2000000000");
    });
  });

  describe("exchangeCoinsToRub", function() {
    let account;

    const dbSetup = async function() {
      await AggregatedInfo.create({});
      await ExchangeRate.setExchangeRate(100, 50);
      account = await Account.create({
        vkId: 1,
        rubAmount: 100,
        coinAmount: 2000000000
      });
    };
    const dbCleanup = async function() {
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

    beforeEach(dbSetup);
    afterEach(dbCleanup);

    it("successful", async () => {
      const result = await coinFinances.exchangeCoinsToRub(account);
      await account.reload();
      expect(result).to.be.equal(1);
      expect(account.coinAmount).to.be.equal("0");
      expect(account.rubAmount).to.be.equal(200);
    });
  });
});