const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('../menu-option');
const rubFinances = require('./../../rub-finances');
const numberFormatter = require('./../../number-formatter');

class ExchangeRubOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const currentRubAmount = account.rubAmountInRub();
    let message;
    if (account.rubAmount === 0) {
      message = '❗ У Вас на балансе 0 RUB.';
    } else if (await rubFinances.isEnoughCoinForExchange(account)) {
      const coins = await rubFinances.exchangeRubToCoins(account);
      message = `
        💱 Вы успешно обменяли ${numberFormatter.formatRub(
          currentRubAmount
        )} RUB на ${numberFormatter.formatCoin(coins)} VK Coin!
        `;
    } else {
      message = `
        💱 Недостаточно VK Coin в системе для обмена!
        `;
    }
    return message;
  }

  get buttonMarkup() {
    return Markup.button('💱 Обменять RUB', 'primary', {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return 'exchange_rub_button';
  }
}

module.exports = ExchangeRubOption;
