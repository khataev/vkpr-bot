const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('../menu-option');
const coinFinances = require('./../../coin-finances');
const numberFormatter = require('./../../number-formatter');

class ExchangeCoinOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const currentCoinAmount = account.coinAmountInCoin();
    let message;
    if (account.coinAmount === 0) {
      message = '❗ У Вас на балансе 0 VK Coin.';
    } else if (await coinFinances.isEnoughRubForExchange(account)) {
      const rubs = await coinFinances.exchangeCoinsToRub(account);
      message = `
        💱 Вы успешно обменяли ${numberFormatter.formatCoin(
          currentCoinAmount
        )} VK Coin на ${numberFormatter.formatRub(rubs)} RUB!
        `;
    } else {
      message = `
        💱 Недостаточно RUB в системе для обмена!
        `;
    }
    return message;
  }

  get buttonMarkup() {
    return Markup.button('💱 Обменять VK Coin', 'primary', {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return 'exchange_coin_button';
  }
}

module.exports = ExchangeCoinOption;
