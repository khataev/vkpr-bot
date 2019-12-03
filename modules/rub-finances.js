const models = require("./../db/models");
const RubTransaction = models.RubTransaction;
const Account = models.Account;

class RubFinances {
  constructor(logger) {
    this.logger = logger;
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

        // TODO: add flag for success processed transaction hook;
        // separate processing of hook info insert + account update (different transactions)
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
}

module.exports = RubFinances;
