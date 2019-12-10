const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const BackMenuOption = require("./back-menu-option");

class SetExchangeRateOption extends MenuOption {
  async chatMessage(botCtx) {
    return `
    Введите новый курс в формате XX/YY,
    где xx - курс Продажи, yy - курс Скупки (в копейках)
    `;
  }

  async beforeReply(botCtx) {
    botCtx.session.chattedContext = {
      chatAllowed: true,
      setExchangeRate: true
    };
  }

  get buttonMarkup() {
    return Markup.button("💸 Установить курс обмена", "primary", {
      button: this.triggerButton
    });
  }

  get menu() {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return "set_exchange_rate_button";
  }
}

module.exports = SetExchangeRateOption;
