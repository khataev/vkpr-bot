const gLogger = require("./logger"); // TODO: get from context
const models = require("./../db/models");
const RubTransaction = models.RubTransaction;
const Account = models.Account;

class RubFinances {
  constructor(logger) {
    this.logger = logger || gLogger;
  }

  async processWebHook(hookInfo) {
    const { test } = hookInfo;
    if (test) {
      return true;
    } else {
      try {
        const {
          payment: {
            type,
            status,
            txnId,
            comment: vkId,
            sum: { amount }
          }
        } = hookInfo;

        if (type !== "IN") return;

        await RubTransaction.create({
          vkId: vkId,
          txnId: txnId,
          hookInfo: hookInfo
        });

        if (status === "SUCCESS") {
          RubTransaction.sequelize.transaction({}, async transaction => {
            await RubTransaction.update(
              {
                isProcessed: true
              },
              { where: { txnId: txnId }, transaction: transaction }
            );

            await Account.increment(
              { rubAmount: amount },
              { where: { vkId: vkId }, transaction: transaction }
            );
          });
        }

        return true;
      } catch (error) {
        this.logger.error(`webhook handler error. ${error.message}`);

        return false;
      }
    }
  }

  async checkIncomePayment(vkId) {
    const transactions = await RubTransaction.findAll({
      where: { vkId: vkId, isProcessed: true, isChecked: false }
    });

    const totalIncome = transactions.reduce(
      acc,
      tr => {
        acc + tr.payment.sum.amount;
      },
      0 // initial value of acc
    );

    const txnIds = transactions.reduce(
      acc,
      tr => {
        acc.push(tr.payment.txnId);
      },
      [] // initial value of acc
    );

    await transactions.update({ isChecked: true });

    return [txnIds, totalIncome];
  }
}

module.exports = RubFinances;
