const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");
const CoinFinances = require("./../../coin-finances");
const coinFinances = new CoinFinances(null);
const settings = require("./../../config"); // get from context

class WithdrawCoinOption extends MenuOption {
  async chatMessage(botCtx) {
    const account = await this.ctx.findOrCreateAccount(botCtx);
    const accountBalance = account.coinAmountInCoin();

    if (accountBalance === 0) {
      return "💶 Ваш баланс равен 0 VK Coins.";
    } else {
      const feedbackUrl = settings.get("shared.feedback_url");
      const isWithdrawSucceeded = await coinFinances.withdrawCoin(account);

      if (isWithdrawSucceeded) {
        return `
        ✔ Мы отправили вам ${accountBalance} VK Coins!

        📈 Оставьте свой отзыв: ${feedbackUrl}
        `;
      } else {
        return `
        ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
        `;
      }
    }
  }

  get buttonMarkup() {
    return Markup.button("📤 Вывести VK Coin", "negative", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "withdraw_coin_button";
  }
}

module.exports = WithdrawCoinOption;
