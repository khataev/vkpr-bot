const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class BalanceOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);

    return `
    💰 Ваш баланс:
    ➕ ${account.coinAmount} VK Coins
    ➕ ${account.rubAmount} ₽
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
