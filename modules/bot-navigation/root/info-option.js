const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const numberFormatter = require("./../../number-formatter");
const models = require("./../../../db/models");
const AggregatedInfo = models.AggregatedInfo;
const ExchangeRate = models.ExchangeRate;

class InfoOption extends MenuOption {
  async chatMessage(botCtx) {
    const rate = await ExchangeRate.currentRate();
    const info = await AggregatedInfo.findOne({});
    const now = new Date();
    return `
    📊 Действительный курс на ${now.getDate()}.${now.getMonth()}.${now.getFullYear()}:
    💲 Продажа VKCoin: 1.000.000 - ${rate.sellRate}коп.
    💱 Скупка VKCoin: 1.000.000 - ${rate.buyRate}коп.

    👥 Всего пользователей: ${info.users}
    💶 Всего платежей: ${info.payments}

    📥 Всего вложено VK Coin: ${numberFormatter.formatCoin(
      info.coinsDeposited / 1000
    )}
    📥 Всего вложено RUB: ${numberFormatter.formatRub(info.rubDeposited / 100)}

    💱 Обменено VK Coin на RUB: ${numberFormatter.formatCoin(
      info.coinsExchanged / 1000
    )}
    💱 Обменено RUB на VK Coin: ${numberFormatter.formatRub(
      info.rubExchanged / 100
    )}

    📤 Всего выведено VK Coin: ${numberFormatter.formatCoin(
      info.coinsWithdrawed / 1000
    )}
    📤 Всего выведено RUB: ${numberFormatter.formatRub(
      info.rubWithdrawed / 100
    )}
    `;
  }

  get buttonMarkup() {
    return Markup.button("📊 Курс / Информация", "secondary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "info_button";
  }
}

module.exports = InfoOption;
