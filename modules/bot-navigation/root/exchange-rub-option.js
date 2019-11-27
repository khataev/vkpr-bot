const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class ExchangeRubOption extends MenuOption {
  get chatMessage() {
    // TODO:
    return "❗ У Вас на балансе 0 RUB.";
  }

  get buttonMarkup() {
    return Markup.button("💱 Обменять RUB", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "exchange_rub_button";
  }
}

module.exports = ExchangeRubOption;
