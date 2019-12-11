const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const CoinFinances = require("./../../coin-finances");
// TODO: add logger to MenuOption
const coinFinances = new CoinFinances(null);

class ExchangeCoinOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const currentCoinAmount = account.coinAmountInCoin();
    if (account.coinAmount == 0) {
      return "❗ У Вас на балансе 0 VK Coin.";
    } else {
      if (await coinFinances.isEnoughRubForExchange(account)) {
        const rubs = await coinFinances.exchangeCoinsToRub(account);
        return `
      💱 Вы успешно обменяли ${currentCoinAmount} VK Coin на ${rubs} RUB!
      `;
      } else {
        return `
      💱 Недостаточно RUB в системе для обмена!
      `;
      }
    }
  }

  get buttonMarkup() {
    return Markup.button("💱 Обменять VK Coin", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "exchange_coin_button";
  }
}

module.exports = ExchangeCoinOption;
