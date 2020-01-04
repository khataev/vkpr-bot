const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const BackMenuOption = require("./back-menu-option");

class SetExchangeRateOption extends MenuOption {
  async chatMessage(botCtx) {
    return `
    Введите новый курс в формате XX/YY,
    где xx - курс Продажи, yy - курс Скупки (в копейках).
    Пример: 90/80
    `;
  }

  async beforeReply(botCtx) {
    botCtx.session.chattedContext = {
      chatAllowed: true,
      setExchangeRate: true
    };
  }

  forbiddenTransitionChatMessage(botCtx) {
    return "Данная функция доступна только администраторам";
  }

  async transitionAllowed(botCtx) {
    return this.ctx.isAdmin(botCtx);
  }

  get buttonMarkup() {
    return Markup.button("💸 Установить курс обмена", "primary", {
      button: this.triggerButton
    });
  }

  menu(botCtx) {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return "set_exchange_rate_button";
  }
}

module.exports = SetExchangeRateOption;
