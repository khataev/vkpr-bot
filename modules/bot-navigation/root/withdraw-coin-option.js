const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class WithdrawCoinOption extends MenuOption {
  chatMessage(botCtx) {
    // TODO:
    return "💶 Ваш баланс равен 0 VK Coins.";
  }

  get buttonMarkup() {
    return Markup.button("📤 Вывести VK Coin", "negative", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "withdraw_coin_button";
  }
}

module.exports = WithdrawCoinOption;
