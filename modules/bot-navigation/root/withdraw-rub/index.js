const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const BackMenuOption = require("./back-menu-option");

class WithdrawRubOption extends MenuOption {
  async chatMessage(botCtx) {
    return "✔ Отлично, теперь введите номер QIWI кошелька в формате";
  }

  forbiddenTransitionChatMessage(botCtx) {
    return "💶 Ваш баланс меньше 1 ₽, вывод на QIWI доступен от 1 ₽.";
  }

  async transitionAllowed(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);

    return account.rubAmount >= 1;
  }

  get buttonMarkup() {
    return Markup.button("📤 Вывести RUB", "negative", {
      button: this.triggerButton
    });
  }

  get menu() {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return "withdraw_rub_button";
  }
}

module.exports = WithdrawRubOption;
