const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class TopUpCoinOption extends MenuOption {
  get chatMessage() {
    return "🔗 Для пополнения баланса, используйте данную ссылку: https://vk.com/coin#x552428793_1000_-1987794042_1";
  }

  get buttonMarkup() {
    return Markup.button("💶 Пополнить VK Coin", "positive", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "top_up_coin_button";
  }
}

module.exports = TopUpCoinOption;
