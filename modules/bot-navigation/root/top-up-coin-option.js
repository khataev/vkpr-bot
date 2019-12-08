const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const CoinFinances = require("./../../coin-finances");
const coinFinances = new CoinFinances(null);

class TopUpCoinOption extends MenuOption {
  chatMessage(botCtx) {
    const url = coinFinances.getVkCoinPaymentUrl();
    return `
    🔗 Для пополнения баланса, используйте данную ссылку: ${url}
    `;
  }

  get buttonMarkup() {
    return Markup.button("💶 Пополнить VK Coin", "positive", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "top_up_coin_button";
  }
}

module.exports = TopUpCoinOption;
