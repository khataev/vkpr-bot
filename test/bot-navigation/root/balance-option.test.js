const { describe, it } = require("mocha");
const { expect } = require("chai");
const { Account, ExchangeRate } = require("@models");
const BalanceOption = require("@menu-root/balance-option");
const {
  SetupContext: { context, dummyBotCtx }
} = require("@test/helpers");
const balanceOption = new BalanceOption(context, {});
const botCtx = dummyBotCtx(1);
const setup = async () => {
  await ExchangeRate.setExchangeRate(100, 50);
};
const cleanup = async () => {
  await ExchangeRate.destroy({ where: {}, truncate: true });
  await Account.destroy({ where: {}, truncate: true });
};

describe("Balance Menu Option", () => {
  beforeEach(setup);
  afterEach(cleanup);

  it("creates account if it absent", async () => {
    // TODO: rename chatMessage to 'action'
    await balanceOption.chatMessage(botCtx);
    const account = await Account.findOne({ where: { vkId: 1 } });
    expect(account.vkId).to.be.equal(1);
  });

  it("returns correct balance", async () => {
    expectedResult = `
    💰 Ваш баланс:
    ➕ 2 000 000.000 VK Coins (1.00 ₽)
    ➕ 1.00 ₽ (1 000 000.000 VK Coins)
    `;
    await Account.create({ vkId: 1, rubAmount: 100, coinAmount: 2000000000 });
    const result = await balanceOption.chatMessage(botCtx);
    expect(result.trim()).to.be.equal(expectedResult.trim());
  });
});
