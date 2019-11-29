const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class ExchangeCoinOption extends MenuOption {
  chatMessage(botCtx) {
    // TODO:
    return "❗ У Вас на балансе 0 VK Coin.";
  }

  get buttonMarkup() {
    return Markup.button("💱 Обменять VK Coin", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "exchange_coin_button";
  }
}

module.exports = ExchangeCoinOption;
