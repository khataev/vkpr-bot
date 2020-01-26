const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');
const { ExchangeRate } = require('@models');
const VkBot = require('node-vk-bot-api');

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

const session = {
  chattedContext: { chatAllowed: true, setExchangeRate: true }
};

describe('Set exchange', () => {
  async function setup() {
    turnOffLogging();

    mainHandler = setupHandlers(bot).mainHandler;
  }
  async function cleanup() {
    bot.middlewares = [];
    ExchangeRate.destroy({ where: {}, truncate: true });
    sinon.restore();
    sandbox.restore();
  }

  // eslint-disable-next-line no-undef
  beforeEach(setup);
  // eslint-disable-next-line no-undef
  afterEach(cleanup);

  function setup0() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
  }

  it('fails because of empty rate message', done => {
    setup0();

    const type = 'message_new';
    const message = null;

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);

    const expectedMessage = 'Не передано значение курса';
    expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
    done();
  });

  it('fails because of wrong format', done => {
    setup0();

    const type = 'message_new';
    const message = '123';

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);

    const expectedMessage = 'Передано некорректное число';
    expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
    done();
  });

  function setup1() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);

    sandbox.spy(ExchangeRate, 'setExchangeRate');
    const fakeSetExchangeRate = sinon.fake.resolves(true);
    sinon.replace(ExchangeRate, 'setExchangeRate', fakeSetExchangeRate);
  }

  it('succeedes with warning', async () => {
    setup1();

    const type = 'message_new';
    const message = '123/124';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage1 =
      'Обычно курс продажи должен превышать курс покупки, иначе это экономически не выгодно';
    expect(bot.sendMessage).to.have.been.calledWith(userId, expectedMessage1);
    const expectedMessage2 = 'Курс успешно установлен';
    expect(bot.sendMessage).to.have.been.calledWith(userId, expectedMessage2);
    expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(123, 124);
  });

  it('succeedes', async () => {
    setup1();

    const type = 'message_new';
    const message = '124/123';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage = 'Курс успешно установлен';
    expect(bot.sendMessage).to.have.been.calledOnceWith(userId, expectedMessage);
    expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(124, 123);
  });

  function setup2() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
    // TODO: can we use only sinon or sandbox ?
    sandbox.spy(ExchangeRate, 'setExchangeRate');
    const fakeSetExchangeRate = sinon.fake.resolves(false);
    sinon.replace(ExchangeRate, 'setExchangeRate', fakeSetExchangeRate);
  }

  it('fails', async () => {
    setup2();

    const type = 'message_new';
    const message = '124/123';

    ctx = vkApiContext(bot, session, type, message);
    await mainHandler(ctx);

    const expectedMessage = 'Произошла ошибка при установке курса';
    expect(bot.sendMessage).to.have.been.calledOnceWith(userId, expectedMessage);
    expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(124, 123);
  });
});
