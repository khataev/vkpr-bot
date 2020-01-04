const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");

class MediumCoinOption extends MenuOption {
  chatMessage() {
    let message;
    if (this.ctx.isPositiveBalance()) {
      const price = 100; // TODO: into settings
      const prize = Math.random() * 400000000;
      message = `
      🎰 Происходит открытие рулетки 🤑 Medium Coin за ${price} ₽, ожидайте!
      
      🎰 С рулетки 🤑 Medium Coin вы получили ${prize} VK Coins!
      `;
    } else {
      message = `
      ❗ У Вас недостаточно средств для открытия рулетки 🤑 Medium Coin!

      ➕ Пополните счёт, нажав "Пополнить RUB" в главном меню.
      `;
    }
    return message;
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
