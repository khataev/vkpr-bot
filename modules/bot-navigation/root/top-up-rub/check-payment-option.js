const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const RubFinances = require("./../../../rub-finances");
const rubFinances = new RubFinances(null);

class CheckPaymentOption extends MenuOption {
  async chatMessage(botCtx) {
    const vkId = this.ctx.getUserId(botCtx);
    console.log("vkId:", vkId);
    const [txnIds, totalIncome] = await rubFinances.checkIncomePayment(vkId);
    console.log("[txnIds, totalIncome]:", [txnIds, totalIncome]);
    let message;

    if (txnIds.length == 0) message = "❗ Мы не нашли новых платежей.";
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
