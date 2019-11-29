const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class BalanceOption extends MenuOption {
  chatMessage(botCtx) {
    // TODO:
    return `
    💰 Ваш баланс:
    ➕ 0 VK Coins
    ➕ 0 ₽
    `;
  }

  get buttonMarkup() {
    return Markup.button("💰 Баланс", "secondary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "balance_button";
  }
}

module.exports = BalanceOption;
