const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');
const { Account } = require('@models');
const balanceManager = require('@modules/balance-manager');
const rubFinances = require('@modules/rub-finances');
const VkBot = require('node-vk-bot-api');
// const Session = require('node-vk-bot-api/lib/session');

const systemBalance = 123;
const TOKEN = '1234'; // HINT: token is not important now
const bot = new VkBot(TOKEN);
const sandbox = sinon.createSandbox();

const setupHandlers = require('@bot-navigation/setup-handlers');

const userId = 1;
chai.use(sinonChai);

const { turnOffLogging } = require('@test/helpers');
const { vkApiContext } = require('@test/fixtures');

let mainHandler;
let ctx;

let session;

describe('Withdraw Rub Menu Option', () => {
  async function setup() {
    turnOffLogging();

    session = {
      chattedContext: { chatAllowed: true, withdrawRub: true }
    };

    const fakeRubBalance = sinon.fake.resolves(systemBalance);
    sinon.replace(balanceManager, 'getRubBalance', fakeRubBalance);

    mainHandler = setupHandlers(bot).mainHandler;
  }
  async function cleanup() {
    bot.middlewares = [];
    await Account.destroy({ where: {}, truncate: true });
    sinon.restore();
    sandbox.restore();
  }

  beforeEach(setup);
  afterEach(cleanup);

  function setup0() {
    const fakeWithdrawRub = sinon.fake.resolves(true);
    sinon.replace(rubFinances, 'withdrawRub', fakeWithdrawRub);

    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
  }

  it('creates account if it is absent', async () => {
    setup0();

    const type = 'message_new';
    const message = '79991111111';

    // emit(bot, type, message);
    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const account = await Account.findOne({ where: { vkId: userId } });
    expect(account.vkId).to.be.equal(userId);
  });

  async function setup1() {
    sandbox.spy(rubFinances, 'withdrawRub');

    const fakeWithdrawRub = sinon.fake.resolves(true);
    sinon.replace(rubFinances, 'withdrawRub', fakeWithdrawRub);

    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);

    await Account.create({
      vkId: userId,
      rubAmount: systemBalance - 1,
      coinAmount: 0
    });
  }

  it('successfully withdraws', async () => {
    await setup1();

    const type = 'message_new';
    const message = '79991111111';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    expect(rubFinances.withdrawRub).to.have.been.calledOnceWith(
      sinon.match.instanceOf(Account),
      '79991111111'
    );
  });

  async function setup2() {
    sandbox.spy(rubFinances, 'withdrawRub');
    sandbox.spy(bot, 'sendMessage');

    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);

    await Account.create({
      vkId: userId,
      rubAmount: systemBalance + 1,
      coinAmount: 0
    });
  }

  it('fails due to lack of system reserve', async () => {
    await setup2();

    const type = 'message_new';
    const message = '79991111111';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage = `
              💱 Недостаточно RUB в системе для вывода!
              `;
    expect(rubFinances.withdrawRub).to.not.have.been.called;
    expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
  });

  async function setup3() {
    sandbox.spy(rubFinances, 'withdrawRub');
    sandbox.spy(bot, 'sendMessage');

    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);

    const fakeWithdrawRub = sinon.fake.resolves(false);
    sinon.replace(rubFinances, 'withdrawRub', fakeWithdrawRub);

    await Account.create({
      vkId: userId,
      rubAmount: systemBalance - 1,
      coinAmount: 0
    });
  }

  it('fails due some error', async () => {
    await setup3();

    const type = 'message_new';
    const message = '79991111111';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage = `
            ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
            `;
    expect(rubFinances.withdrawRub).to.have.been.called;
    expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
  });

  function setup4() {
    sandbox.spy(rubFinances, 'withdrawRub');
    sandbox.spy(bot, 'sendMessage');

    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
  }

  it('fails due invalid phone', async () => {
    setup4();

    const type = 'message_new';
    const message = '7999111111';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage = 'Неверный формат телефона';
    expect(rubFinances.withdrawRub).to.not.have.been.called;
    expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
  });
});
