const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const numberFormatter = require("./../../number-formatter");
const rubFinances = require("./../../rub-finances");
const coinFinances = require("./../../coin-finances");
const models = require("./../../../db/models");
const ExchangeRate = models.ExchangeRate;
class BalanceOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const rate = await ExchangeRate.currentRate();

    const coinAmountStr = numberFormatter.formatCoin(
      account.coinAmountInCoin()
    );
    const rubEquivAmountStr = numberFormatter.formatRub(
      coinFinances.coinToRub(account.coinAmount, rate) / 100
    );

    const rubAmountStr = numberFormatter.formatRub(account.rubAmountInRub());
    const coinEquivAmountStr = numberFormatter.formatCoin(
      rubFinances.rubToCoins(account.rubAmount, rate) / 1000
    );

    return `
    💰 Ваш баланс:
    ➕ ${coinAmountStr} VK Coins (${rubEquivAmountStr} ₽)
    ➕ ${rubAmountStr} ₽ (${coinEquivAmountStr} VK Coins)
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
