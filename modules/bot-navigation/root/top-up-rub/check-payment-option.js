const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const rubFinances = require("./../../../rub-finances");

class CheckPaymentOption extends MenuOption {
  async chatMessage(botCtx) {
    const vkId = this.ctx.getUserId(botCtx);
    const [txnIds, totalIncome] = await rubFinances.checkIncomePayment(vkId);
    let message;

    if (txnIds.length === 0) message = "❗ Мы не нашли новых платежей.";
    else {
      message = `➕ На Ваш аккаунт было зачислено ${totalIncome} ₽ (ID транзакции: ${txnIds.join(
        ", "
      )})`;
    }

    return message;
  }

  get buttonMarkup() {
    return Markup.button("➕ Проверить оплату", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "check_payment_button";
  }
}

module.exports = CheckPaymentOption;
