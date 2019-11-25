const MenuOption = require("../../menu-option");

class LowCoinOption extends MenuOption {
  chatMessage() {
    if (ctx.isPositiveBalance()) {
      const price = 25; // todo: into settings
      const prize = Math.random() * 100_000_000;
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

  buttonMarkup() {
    return Markup.button("🤑 Low Coin", "positive");
  }
}

module.exports = LowCoinOption;
