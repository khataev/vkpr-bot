const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");

class LowCoinOption extends MenuOption {
  get chatMessage() {
    if (this.ctx.isPositiveBalance()) {
      const price = 25; // todo: into settings
      const prize = Math.random() * 100_000_000;
      // TODO: check influence of text indent
      return `
      🎰 Происходит открытие рулетки 🤑 Low Coin за ${price} ₽, ожидайте!
      
      🎰 С рулетки 🤑 Low Coin вы получили ${prize} VK Coins!
      `;
    } else {
      return `
      ❗ У Вас недостаточно средств для открытия рулетки 🤑 Low Coin!

      ➕ Пополните счёт, нажав "Пополнить RUB" в главном меню.
      `;
    }
  }

  get buttonMarkup() {
    return Markup.button("🤑 Low Coin", "positive", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "low_coin_button";
  }
}

module.exports = LowCoinOption;
