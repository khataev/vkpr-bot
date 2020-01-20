const { describe, it } = require('mocha');
const sinon = require('sinon');
const { expect } = require('chai');
const TopUpOption = require('@menu-root/top-up-coin-option');
const {
  SetupContext: { context, dummyBotCtx }
} = require('@test/helpers');

const topUpOption = new TopUpOption(context, {});
const coinFinances = require('@modules/coin-finances');

const botCtx = dummyBotCtx(1);
const setup = async () => {
  const fakeVkPaymentUrl = sinon.fake.returns('http://top-up-url.com');
  sinon.replace(coinFinances, 'getVkCoinPaymentUrl', fakeVkPaymentUrl);
};
const cleanup = async () => {
  sinon.restore();
};

describe('Top Up Coin Menu Option', () => {
  // eslint-disable-next-line no-undef
  beforeEach(setup);
  // eslint-disable-next-line no-undef
  afterEach(cleanup);

  it('returns correct balance', async () => {
    const expectedResult = `
    🔗 Для пополнения баланса, используйте данную ссылку: http://top-up-url.com
    `;
    const result = await topUpOption.chatMessage(botCtx);
    expect(result.trim()).to.be.equal(expectedResult.trim());
  });
});
