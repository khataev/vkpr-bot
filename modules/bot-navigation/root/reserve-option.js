const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const RubFinances = require("./../../rub-finances");
const rubFinances = new RubFinances(null);
const CoinFinances = require("./../../coin-finances");
const coinFinances = new CoinFinances(null);

class ReserveOption extends MenuOption {
  async chatMessage(botCtx) {
    const rubBalance = (await rubFinances.getBalance()) / 100;
    const coinBalance = (await coinFinances.getBalance()) / 1000;
    return `
    💸 Резерв QIWI: ${rubBalance} ₽
    💸 Резерв VK Coins: ${coinBalance}
    `;
  }

  get buttonMarkup() {
    return Markup.button("💸 Резерв", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "reserve_button";
  }
}

module.exports = ReserveOption;
