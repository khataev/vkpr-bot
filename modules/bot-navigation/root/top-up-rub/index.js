const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const CheckPaymentOption = require("./check-payment-option");
const BackMenuOption = require("./back-menu-option");

class TopUpRubOption extends MenuOption {
  get chatMessage() {
    // TODO: generate link and VK ID
    // TODO: divide into 2 messages?
    return `
🔗 Для пополнения баланса, используйте данную ссылку: https://vk.cc/a2ZgAN

❗ Для корректной формы используйте браузер.
 
▪РУЧНОЙ ПЕРЕВОД СРЕДСТВ▪
👐 При ручном переводе(с приложения QIWI и.тд) переводить на номер: +79042067031
💭 Комментарий к платежу указать этот: 35549534

❗ Без комментария Ваш платёж не обработается, будьте бдительны.
✅ После оплаты нажмите "➕ Проверить оплату"
▪РУЧНОЙ ПЕРЕВОД СРЕДСТВ▪
    `;
  }

  get buttonMarkup() {
    return Markup.button("💶 Пополнить RUB", "positive", {
      button: this.triggerButton
    });
  }

  get menu() {
    return [
      [new CheckPaymentOption(this.ctx, this)],
      [new BackMenuOption(this.ctx, this)]
    ];
  }

  get triggerButton() {
    return "top_up_rub_button";
  }
}

module.exports = TopUpRubOption;
