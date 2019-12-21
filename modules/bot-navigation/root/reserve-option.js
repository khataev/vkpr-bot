const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const models = require("./../../../db/models");
const ExchangeRate = models.ExchangeRate;
const numberFormatter = require("./../../number-formatter");
const BalanceManager = require("./../../balance-manager");
const RubFinances = require("./../../rub-finances");
const CoinFinances = require("./../../coin-finances");
const balanceManager = new BalanceManager(null);
const rubFinances = new RubFinances(null);
const coinFinances = new CoinFinances(null);

class ReserveOption extends MenuOption {
  async chatMessage(botCtx) {
    const rate = await ExchangeRate.currentRate();

    const rubBalance = await balanceManager.getRubBalance();
    const rubBalanceStr = numberFormatter.formatRub(rubBalance / 100);
    const coinEquivStr = numberFormatter.formatCoin(
      rubFinances.rubToCoins(rubBalance, rate) / 1000
    );

    const coinBalance = await balanceManager.getCoinBalance();
    const coinBalanceStr = numberFormatter.formatCoin(coinBalance / 1000);
    const rubEquivStr = numberFormatter.formatRub(
      coinFinances.coinToRub(coinBalance, rate) / 100
    );

    return `
    💸 Резерв QIWI: ${rubBalanceStr} ₽ (${coinEquivStr} VK Coins)
    💸 Резерв VK Coins: ${coinBalanceStr} (${rubEquivStr} ₽)
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
