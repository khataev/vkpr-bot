const Markup = require('node-vk-bot-api/lib/markup');
const settings = require('./../../../config');
const MenuOption = require('../../menu-option');
const CheckPaymentOption = require('./check-payment-option');
const BackMenuOption = require('./back-menu-option');
const rubFinances = require('./../../../rub-finances');

class TopUpRubOption extends MenuOption {
  async chatMessage(botCtx) {
    // TODO: generate link and VK ID
    // TODO: divide into 2 messages?
    const userId = this.ctx.getUserId(botCtx);
    const topUpUrl = await rubFinances.getShortQiwiPaymentUrl(userId);
    const accountNumber = settings.get('credentials.qiwi.account_number');

    return `
    🔗 Для пополнения баланса, используйте данную ссылку: ${topUpUrl}

    ❗ Для корректной формы используйте браузер.
    
    ▪РУЧНОЙ ПЕРЕВОД СРЕДСТВ▪
    👐 При ручном переводе(с приложения QIWI и.тд) переводить на номер: +${accountNumber}
    💭 Комментарий к платежу указать этот: ${userId}

    ❗ Без комментария Ваш платёж не обработается, будьте бдительны.
    ✅ После оплаты нажмите "➕ Проверить оплату"
    ▪РУЧНОЙ ПЕРЕВОД СРЕДСТВ▪
    `;
  }

  get buttonMarkup() {
    return Markup.button('💶 Пополнить RUB', 'positive', {
      button: this.triggerButton
    });
  }

  menu() {
    return [[new CheckPaymentOption(this.ctx, this)], [new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return 'top_up_rub_button';
  }
}

module.exports = TopUpRubOption;
