const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");

class MediumCoinOption extends MenuOption {
  chatMessage(botCtx) {
    if (this.ctx.isPositiveBalance()) {
      const price = 100; // TODO: into settings
      const prize = Math.random() * 400_000_000;
      return `
      🎰 Происходит открытие рулетки 🤑 Medium Coin за ${price} ₽, ожидайте!
      
      🎰 С рулетки 🤑 Medium Coin вы получили ${prize} VK Coins!
      `;
    } else {
      return `
      ❗ У Вас недостаточно средств для открытия рулетки 🤑 Medium Coin!

      ➕ Пополните счёт, нажав "Пополнить RUB" в главном меню.
      `;
    }
  }

  get buttonMarkup() {
    return Markup.button("🤑 Medium Coin", "negative", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "medium_coin_button";
  }
}

module.exports = MediumCoinOption;
