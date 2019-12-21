const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const numberFormatter = require("./../../number-formatter");
const RubFinances = require("./../../rub-finances");
const CoinFinances = require("./../../coin-finances");
const models = require("./../../../db/models");
const ExchangeRate = models.ExchangeRate;
const rubFinances = new RubFinances(null);
const coinFinances = new CoinFinances(null);
class BalanceOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const rate = await ExchangeRate.currentRate();

    const coinAmount = numberFormatter.formatCoin(account.coinAmountInCoin());
    const rubEquialentAmount = numberFormatter.formatRub(
      coinFinances.coinToRub(account.coinAmount, rate) / 100
    );

    const rubAmount = numberFormatter.formatRub(account.rubAmountInRub());
    const coinEquialentAmount = numberFormatter.formatCoin(
      rubFinances.rubToCoins(account.rubAmount, rate) / 1000
    );

    return `
    💰 Ваш баланс:
    ➕ ${coinAmount} VK Coins (${rubEquialentAmount} ₽)
    ➕ ${rubAmount} ₽ (${coinEquialentAmount} VK Coins)
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
