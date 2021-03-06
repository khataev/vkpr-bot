const { describe, it } = require('mocha');
const sinon = require('sinon');
const { expect } = require('chai');
const { ExchangeRate } = require('@models');
const ReserveOption = require('@menu-root/reserve-option');
const {
  SetupContext: { context, dummyBotCtx }
} = require('@test/helpers');

const reserveOption = new ReserveOption(context, {});
const balanceManager = require('@modules/balance-manager');

const botCtx = dummyBotCtx(1);
const setup = async () => {
  await ExchangeRate.setExchangeRate(100, 50);
  const fakeCoinBalance = sinon.fake.resolves(2000000000);
  const fakeRubBalance = sinon.fake.resolves(250);
  sinon.replace(balanceManager, 'getCoinBalance', fakeCoinBalance);
  sinon.replace(balanceManager, 'getRubBalance', fakeRubBalance);
};
const cleanup = async () => {
  await ExchangeRate.destroy({ where: {}, truncate: true });
  sinon.restore();
};

describe('Balance Menu Option', () => {
  // eslint-disable-next-line no-undef
  beforeEach(setup);
  // eslint-disable-next-line no-undef
  afterEach(cleanup);

  it('returns correct balance', async () => {
    const expectedResult = `
    💸 Резерв VK Coins: 2 000 000.000 (2.00 ₽)
    💸 Резерв QIWI: 2.50 ₽ (5 000 000.000 VK Coins)
    `;
    const result = await reserveOption.chatMessage(botCtx);
    expect(result.trim()).to.be.equal(expectedResult.trim());
  });
});
