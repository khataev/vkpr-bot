const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const numberFormatter = require("./../../number-formatter");
const BalanceManager = require("./../../balance-manager");
const balanceManager = new BalanceManager(null);

class ReserveOption extends MenuOption {
  async chatMessage(botCtx) {
    const rubBalance = (await balanceManager.getRubBalance()) / 100;
    const coinBalance = (await balanceManager.getCoinBalance()) / 1000;
    return `
    💸 Резерв QIWI: ${numberFormatter.formatRub(rubBalance)} ₽
    💸 Резерв VK Coins: ${numberFormatter.formatCoin(coinBalance)}
    `;
  }

  get buttonMarkup() {
    return Markup.button("💸 Резерв", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "reserve_button";
  }
}

module.exports = ReserveOption;
