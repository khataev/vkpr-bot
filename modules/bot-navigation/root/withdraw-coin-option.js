const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('../menu-option');
const coinFinances = require('./../../coin-finances');
const settings = require('./../../config');
const balanceManager = require('./../../balance-manager');
const numberFormatter = require('./../../number-formatter');

class WithdrawCoinOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const accountBalance = account.coinAmountInCoin();

    // Проверка на 0
    if (accountBalance === 0) return '💶 Ваш баланс равен 0 VK Coins.';

    // Проверка на достаточное колиество денег в системе
    const systemBalance = await balanceManager.getCoinBalance();
    if (systemBalance < account.coinAmount) {
      this.ctx.sendMessageToAdmins(
        `Недостаточно VK Coin для вывода ${numberFormatter.formatCoin(accountBalance)}`
      );
      return `
        💱 Недостаточно VK Coin в системе для вывода!
        `;
    }

    // Все хорошо
    const feedbackUrl = settings.get('shared.feedback_url');
    const isWithdrawSucceeded = await coinFinances.withdrawCoin(account);
    let message;
    if (isWithdrawSucceeded) {
      message = `
        ✔ Мы отправили вам ${numberFormatter.formatCoin(accountBalance)} VK Coins!

        📈 Оставьте свой отзыв: ${feedbackUrl}
        `;
    } else {
      message = `
        ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
        `;
    }

    return message;
  }

  get buttonMarkup() {
    return Markup.button('📤 Вывести VK Coin', 'negative', {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return 'withdraw_coin_button';
  }
}

module.exports = WithdrawCoinOption;
