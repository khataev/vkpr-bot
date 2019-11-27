const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");

class CheckPaymentOption extends MenuOption {
  get chatMessage() {
    // TODO
    return "❗ Мы не нашли новых платежей.";
  }

  get buttonMarkup() {
    return Markup.button("➕ Проверить оплату", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "check_payment_button";
  }
}

module.exports = CheckPaymentOption;
