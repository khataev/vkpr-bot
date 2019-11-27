const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class WithdrawRubOption extends MenuOption {
  get chatMessage() {
    // TODO:
    return "💶 Ваш баланс меньше 1 ₽, вывод на QIWI доступен от 1 ₽.";
  }

  get buttonMarkup() {
    return Markup.button("📤 Вывести RUB", "negative", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "withdraw_rub_button";
  }
}

module.exports = WithdrawRubOption;
