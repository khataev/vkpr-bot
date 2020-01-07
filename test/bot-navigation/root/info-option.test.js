const { describe, it } = require("mocha");
const lolex = require("lolex");
const { expect } = require("chai");
const { AggregatedInfo, ExchangeRate } = require("@models");
const InfoOption = require("@menu-root/info-option");
const { context, dummyBotCtx } = require("@test/helpers/setup-context");
const infoOption = new InfoOption(context, {});
const botCtx = dummyBotCtx(1);
const date = new Date(1997, 4, 19);
let clock;
const dbSetup = async () => {
  clock = lolex.install({ now: date });
  await ExchangeRate.setExchangeRate(100, 50);
};
const dbCleanup = async () => {
  clock.uninstall();
  await ExchangeRate.destroy({ where: {}, truncate: true });
  await AggregatedInfo.destroy({ where: {}, truncate: true });
};

describe("Info Menu Option", () => {
  beforeEach(dbSetup);
  afterEach(dbCleanup);

  it("returns correct info", async () => {
    expectedResult = `
    📊 Действительный курс на 19.5.1997:
    💲 Продажа VKCoin: 1.000.000 - 100коп.
    💱 Скупка VKCoin: 1.000.000 - 50коп.

    👥 Всего пользователей: 1
    💶 Всего платежей: 2

    📥 Всего вложено VK Coin: 1 000 000.000
    📥 Всего вложено RUB: 10.00

    💱 Обменено VK Coin на RUB: 2 000 000.000
    💱 Обменено RUB на VK Coin: 20.00

    📤 Всего выведено VK Coin: 3 000 000.000
    📤 Всего выведено RUB: 30.00
    `;
    await AggregatedInfo.create({
      users: 1,
      payments: 2,
      coinsDeposited: 1000000000,
      rubDeposited: 1000,
      coinsExchanged: 2000000000,
      rubExchanged: 2000,
      coinsWithdrawed: 3000000000,
      rubWithdrawed: 3000
    });

    const result = await infoOption.chatMessage(botCtx);
    expect(result.trim()).to.be.equal(expectedResult.trim());
  });
});
