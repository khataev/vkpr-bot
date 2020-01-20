const { describe, it } = require('mocha');
const sinon = require('sinon');
const { expect } = require('chai');
const TopUpOption = require('@menu-root/top-up-rub');
const {
  SetupContext: { context, dummyBotCtx }
} = require('@test/helpers');

const topUpOption = new TopUpOption(context, {});
const rubFinances = require('@modules/rub-finances');

const botCtx = dummyBotCtx(1);
const dbSetup = async () => {
  const fakeQiwiPaymentUrl = sinon.fake.resolves('http://top-up-url.com');
  sinon.replace(rubFinances, 'getShortQiwiPaymentUrl', fakeQiwiPaymentUrl);
};
const dbCleanup = async () => {
  sinon.restore();
};

describe('Top Up Rub Menu Option', () => {
  beforeEach(dbSetup);
  afterEach(dbCleanup);

  it('returns correct balance', async () => {
    expectedResult = `
    🔗 Для пополнения баланса, используйте данную ссылку: http://top-up-url.com
    `;
    const result = await topUpOption.chatMessage(botCtx);
    expect(result.trim()).to.include(expectedResult.trim());
  });
});
