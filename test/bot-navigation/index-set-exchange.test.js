const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
const { ExchangeRate } = require("@models");
const BotNavigation = require("@bot-navigation");
const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");

// TODO: get rid of event emitter
const eventEmitter = require("@modules/event-emitter");
const TOKEN = "1234"; // HINT: token is not important now
const bot = new VkBot(TOKEN);
const sandbox = sinon.createSandbox();

const userId = 1;
chai.use(sinonChai);

const { turnOffLogging } = require("@test/helpers/logging");
const { emit } = require("@test/helpers/messaging");

describe("Set exchange", () => {
  async function setup() {
    turnOffLogging();

    const store = new Map();
    store.set(`${userId}`, {
      chattedContext: { chatAllowed: true, setExchangeRate: true }
    });

    const session = new Session({
      store: store,
      getSessionKey: () => {
        return `${userId}`;
      }
    });

    bot.use(session.middleware());
    nav = new BotNavigation(bot);
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
    sinon.replace(bot, "sendMessage", fakeSendMessage);
  }

  it("fails because of empty rate message", done => {
    setup0();

    eventEmitter.once("chattedContextHandlingDone", async () => {
      const expectedMessage = "Не передано значение курса";
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      done();
    });

    const type = "message_new";
    const message = null;

    emit(bot, type, message);
  });

  it("fails because of wrong format", done => {
    setup0();

    eventEmitter.once("chattedContextHandlingDone", async () => {
      const expectedMessage = "Передано некорректное число";
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      done();
    });

    const type = "message_new";
    const message = "123";

    emit(bot, type, message);
  });

  function setup1() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, "sendMessage", fakeSendMessage);

    sandbox.spy(ExchangeRate, "setExchangeRate");
    const fakeSetExchangeRate = sinon.fake.resolves(true);
    sinon.replace(ExchangeRate, "setExchangeRate", fakeSetExchangeRate);
  }

  it("succeedes with warning", done => {
    setup1();

    eventEmitter.once("chattedContextHandlingDone", async () => {
      const expectedMessage1 =
        "Обычно курс продажи должен превышать курс покупки, иначе это экономически не выгодно";
      expect(bot.sendMessage).to.have.been.calledWith(1, expectedMessage1);

      const expectedMessage2 = "Курс успешно установлен";
      expect(bot.sendMessage).to.have.been.calledWith(1, expectedMessage2);

      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(
        123,
        124
      );

      done();
    });

    const type = "message_new";
    const message = "123/124";

    emit(bot, type, message);
  });

  it("succeedes", done => {
    setup1();

    eventEmitter.once("chattedContextHandlingDone", async () => {
      const expectedMessage = "Курс успешно установлен";
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);

      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(
        124,
        123
      );

      done();
    });

    const type = "message_new";
    const message = "124/123";

    emit(bot, type, message);
  });

  function setup2() {
    const fakeSendMessage = sinon.fake.returns(null);
    sinon.replace(bot, "sendMessage", fakeSendMessage);
    // TODO: can we use only sinon or sandbox ?
    sandbox.spy(ExchangeRate, "setExchangeRate");
    const fakeSetExchangeRate = sinon.fake.resolves(false);
    sinon.replace(ExchangeRate, "setExchangeRate", fakeSetExchangeRate);
  }

  it("fails", done => {
    setup2();

    eventEmitter.once("chattedContextHandlingDone", async () => {
      const expectedMessage = "Произошла ошибка при установке курса";
      expect(bot.sendMessage).to.have.been.calledOnceWith(1, expectedMessage);
      expect(ExchangeRate.setExchangeRate).to.have.been.calledOnceWith(
        124,
        123
      );
      done();
    });

    const type = "message_new";
    const message = "124/123";

    emit(bot, type, message);
  });
});
