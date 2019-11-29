const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const LowCoinOption = require("./low-coin-option");
const MediumCoinOption = require("./medium-coin-option");
const BackMenuOption = require("./../../back-menu-option");

class RouletteOption extends MenuOption {
  chatMessage(botCtx) {
    return `
    🎰 Добро пожаловать в раздел 'Рулетки'.
    📃 В данном разделе Вы можете приобрести различные рулетки с выигрышем в VK Coin!
    Список текущих рулеток:
    · 🤑 Low Coin — 25 ₽.
    ❓ Возможный выигрыш: от 5000000 VK Coins до 50000000 VK Coins.
    💭 Желаете дешево наполнить свой кошелек VK Coin до границ? Эта рулетка для вас!

    · 💳 Medium Coin — 100 ₽.
    ❓ Возможный выигрыш: от 50000000 VK Coins до 150000000 VK Coins.
    💭 Богатство - не предел, с помощью этой рулетки вы сможете разбогатеть в один миг!

    ✅ Для приобретения рулетки нажмите кнопку на клавиатуре снизу.
    `;
  }

  get buttonMarkup() {
    return Markup.button("🎰 Рулетка", "secondary", {
      button: this.triggerButton
    });
  }

  get menu() {
    return [
      new LowCoinOption(this.ctx, this),
      new MediumCoinOption(this.ctx, this),
      new BackMenuOption(this.ctx, this)
    ];
  }

  get triggerButton() {
    return "roulette";
  }
}

module.exports = RouletteOption;
