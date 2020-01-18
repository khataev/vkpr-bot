const { describe, it } = require("mocha");
const sinon = require("sinon");
const { expect } = require("chai");
const { Account } = require("@models");
const WithdrawOption = require("@menu-root/withdraw-coin-option");
const {
  SetupContext: { context, dummyBotCtx }
} = require("@test/helpers");
const withdrawOption = new WithdrawOption(context, {});
const balanceManager = require("@modules/balance-manager");
const coinFinances = require("@modules/coin-finances");
const botCtx = dummyBotCtx(1);
const dbSetup = async () => {};
const dbCleanup = async () => {
  await Account.destroy({ where: {}, truncate: true });
  sinon.restore();
};

describe("Withdraw Coin Menu Option", () => {
  beforeEach(dbSetup);
  afterEach(dbCleanup);

  it("creates account if it absent", async () => {
    await withdrawOption.chatMessage(botCtx);
    const account = await Account.findOne({ where: { vkId: 1 } });
    expect(account.vkId).to.be.equal(1);
  });

  it("declines to withdraw zero balance", async () => {
    expectedResult = "💶 Ваш баланс равен 0 VK Coins.";
    await Account.create({ vkId: 1 });
    const result = await withdrawOption.chatMessage(botCtx);
    expect(result.trim()).to.be.equal(expectedResult.trim());
  });

  it("declines to withdraw when there is not enough money", async () => {
    const fakeCoinBalance = sinon.fake.resolves(1000);
    sinon.replace(balanceManager, "getCoinBalance", fakeCoinBalance);

    expectedResult = "💱 Недостаточно VK Coin в системе для вывода!";
    const account = await Account.create({ vkId: 1, coinAmount: 1000000000 });
    const result = await withdrawOption.chatMessage(botCtx);
    await account.reload();
    expect(result.trim()).to.be.equal(expectedResult.trim());
    expect(account.coinAmount).to.be.equal("1000000000");
  });

  it("successful withdraw", async () => {
    const fakeCoinBalance = sinon.fake.resolves(1000000001);
    sinon.replace(balanceManager, "getCoinBalance", fakeCoinBalance);

    // TODO: unit test of coinFinances.withdrawCoin
    const fakeWithdrawCoin = sinon.fake.resolves(true);
    sinon.replace(coinFinances, "withdrawCoin", fakeWithdrawCoin);

    expectedResult = "✔ Мы отправили вам 1 000 000.000 VK Coins!";
    await Account.create({
      vkId: 1,
      coinAmount: 1000000000
    });
    const result = await withdrawOption.chatMessage(botCtx);
    expect(result.trim()).to.include(expectedResult.trim());
  });

  it("unsuccessful withdraw", async () => {
    const fakeCoinBalance = sinon.fake.resolves(1000000001);
    sinon.replace(balanceManager, "getCoinBalance", fakeCoinBalance);

    const fakeWithdrawCoin = sinon.fake.resolves(false);
    sinon.replace(coinFinances, "withdrawCoin", fakeWithdrawCoin);

    expectedResult = `
        ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
        `;
    await Account.create({ vkId: 1, coinAmount: 1000000000 });
    const result = await withdrawOption.chatMessage(botCtx);
    expect(result.trim()).to.include(expectedResult.trim());
  });
});
