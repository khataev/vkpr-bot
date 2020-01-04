const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('../../menu-option');
const BackMenuOption = require('./back-menu-option');

class WithdrawRubOption extends MenuOption {
  async chatMessage() {
    return '✔ Отлично, теперь введите номер QIWI кошелька в формате 79991111111';
  }

  forbiddenTransitionChatMessage() {
    return '💶 Ваш баланс меньше 1 ₽, вывод на QIWI доступен от 1 ₽.';
  }

  async transitionAllowed(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);

    return account.rubAmountInRub() >= 1;
  }

  async beforeReply(botCtx) {
    botCtx.session.chattedContext = { chatAllowed: true, withdrawRub: true };
  }

  get buttonMarkup() {
    return Markup.button('📤 Вывести RUB', 'negative', {
      button: this.triggerButton
    });
  }

  menu() {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return 'withdraw_rub_button';
  }
}

module.exports = WithdrawRubOption;
