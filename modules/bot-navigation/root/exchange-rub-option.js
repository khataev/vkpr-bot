const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const RubFinances = require("./../../rub-finances");
const rubFinances = new RubFinances();
const numberFormatter = require("./../../number-formatter");

class ExchangeRubOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const currentRubAmount = account.rubAmountInRub();
    if (account.rubAmount == 0) {
      return "❗ У Вас на балансе 0 RUB.";
    } else {
      if (await rubFinances.isEnoughCoinForExchange(account)) {
        const coins = await rubFinances.exchangeRubToCoins(account);
        return `
        💱 Вы успешно обменяли ${numberFormatter.formatRub(
          currentRubAmount
        )} RUB на ${numberFormatter.formatCoin(coins)} VK Coin!
        `;
      } else {
        return `
        💱 Недостаточно VK Coin в системе для обмена!
        `;
      }
    }
  }

  get buttonMarkup() {
    return Markup.button("💱 Обменять RUB", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "exchange_rub_button";
  }
}

module.exports = ExchangeRubOption;
