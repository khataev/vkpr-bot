const { describe, it } = require('mocha');
const { expect } = require('chai');
const { Account, ExchangeRate } = require('@models');
const ExchangeOption = require('@menu-root/exchange-rub-option');
const {
  SetupContext: { context, dummyBotCtx }
} = require('@test/helpers');

const exchangeOption = new ExchangeOption(context, {});
const botCtx = dummyBotCtx(1);
const dbSetup = async () => {
  await ExchangeRate.setExchangeRate(100, 50);
};
const dbCleanup = async () => {
  await ExchangeRate.destroy({ where: {}, truncate: true });
  await Account.destroy({ where: {}, truncate: true });
};

describe('Exchange Rub Menu Option', () => {
  beforeEach(dbSetup);
  afterEach(dbCleanup);

  it('creates account if it absent', async () => {
    await exchangeOption.chatMessage(botCtx);
    const account = await Account.findOne({ where: { vkId: 1 } });
    expect(account.vkId).to.be.equal(1);
  });

  it('performs exchange', async () => {
    const expectedResult = `
    💱 Вы успешно обменяли 1.00 RUB на 1 000 000.000 VK Coin!
    `;
    const account = await Account.create({
      vkId: 1,
      rubAmount: 100,
      coinAmount: 2000000000
    });
    const result = await exchangeOption.chatMessage(botCtx);
    await account.reload();
    expect(result.trim()).to.be.equal(expectedResult.trim());
    expect(account.coinAmount).to.be.equal('3000000000');
    expect(account.rubAmount).to.be.equal(0);
  });
});
