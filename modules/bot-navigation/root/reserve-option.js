const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const { ExchangeRate } = require("./../../../db/models");
const numberFormatter = require("./../../number-formatter");
const balanceManager = require("./../../balance-manager");
const rubFinances = require("./../../rub-finances");
const coinFinances = require("./../../coin-finances");

class ReserveOption extends MenuOption {
  async chatMessage() {
    const rate = await ExchangeRate.currentRate();

    const rubBalance = await balanceManager.getRubBalance();
    const rubBalanceStr = numberFormatter.formatRub(rubBalance / 100);
    const coinEquivStr = numberFormatter.formatCoin(
      rubFinances.rubToCoins(rubBalance, rate) / 1000
    );

    const coinBalance = await balanceManager.getCoinBalance();
    const coinBalanceStr = numberFormatter.formatCoin(coinBalance / 1000);
    const rubEquivStr = numberFormatter.formatRub(coinFinances.coinToRub(coinBalance, rate) / 100);

    return `
    💸 Резерв VK Coins: ${coinBalanceStr} (${rubEquivStr} ₽)
    💸 Резерв QIWI: ${rubBalanceStr} ₽ (${coinEquivStr} VK Coins)
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
