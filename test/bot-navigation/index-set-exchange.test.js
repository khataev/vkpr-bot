const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const { ExchangeRate } = require('@models');
const VkBot = require('node-vk-bot-api');

// TODO: get rid of event emitter
const eventEmitter = require('@modules/event-emitter');
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

    // const store = new Map();
    // store.set(`${userId}`, {
    //   chattedContext: { chatAllowed: true, setExchangeRate: true }
    // });

    // const session = new Session({
    //   store: store,
    //   getSessionKey: () => {
    //     return `${userId}`;
    //   }
    // });

    // bot.use(session.middleware());
    mainHandler = setupHandlers(bot).mainHandler;
  }
  async function cleanup() {
    bot.middlewares = [];
    ExchangeRate.destroy({ where: {}, truncate: true });
    sinon.restore();
    sandbox.restore();
  }

  beforeEach(setup);
  afterEach(cleanup);

  function setup0() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
  }

  it('fails because of empty rate message', done => {
    setup0();

    eventEmitter.once('chattedContextHandlingDone', async () => {
      const expectedMessage = 'Не передано значение курса';
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      done();
    });

    const type = 'message_new';
    const message = null;

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);
  });

  it('fails because of wrong format', done => {
    setup0();

    eventEmitter.once('chattedContextHandlingDone', async () => {
      const expectedMessage = 'Передано некорректное число';
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      done();
    });

    const type = 'message_new';
    const message = '123';

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);
  });

  function setup1() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);

    sandbox.spy(ExchangeRate, 'setExchangeRate');
    const fakeSetExchangeRate = sinon.fake.resolves(true);
    sinon.replace(ExchangeRate, 'setExchangeRate', fakeSetExchangeRate);
  }

  it('succeedes with warning', done => {
    setup1();

    eventEmitter.once('chattedContextHandlingDone', async () => {
      const expectedMessage1 =
        'Обычно курс продажи должен превышать курс покупки, иначе это экономически не выгодно';
      expect(bot.sendMessage).to.have.been.calledWith(1, expectedMessage1);

      const expectedMessage2 = 'Курс успешно установлен';
      expect(bot.sendMessage).to.have.been.calledWith(1, expectedMessage2);

      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(123, 124);

      done();
    });

    const type = 'message_new';
    const message = '123/124';

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);
  });

  it('succeedes', done => {
    setup1();

    eventEmitter.once('chattedContextHandlingDone', async () => {
      const expectedMessage = 'Курс успешно установлен';
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);

      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(124, 123);

      done();
    });

    const type = 'message_new';
    const message = '124/123';

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);
  });

  function setup2() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, 'sendMessage', fakeSendMessage);
    // TODO: can we use only sinon or sandbox ?
    sandbox.spy(ExchangeRate, 'setExchangeRate');
    const fakeSetExchangeRate = sinon.fake.resolves(false);
    sinon.replace(ExchangeRate, 'setExchangeRate', fakeSetExchangeRate);
  }

  it('fails', done => {
    setup2();

    eventEmitter.once('chattedContextHandlingDone', async () => {
      const expectedMessage = 'Произошла ошибка при установке курса';
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(124, 123);
      done();
    });

    const type = 'message_new';
    const message = '124/123';

    ctx = vkApiContext(bot, session, type, message);
    mainHandler(ctx);
  });
});
