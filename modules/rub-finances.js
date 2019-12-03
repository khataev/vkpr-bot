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
        if (type === "IN" && status === "SUCCESS") {
          RubTransaction.sequelize.transaction({}, async transaction => {
            await RubTransaction.create(
              {
                vkId: vkId,
                txnId: txnId,
                hookInfo: hookInfo
              },
              { transaction: transaction }
            );

            const account = await Account.findOne({ where: { vkId: vkId } });
            await account.update(
              { rubAmount: account.rubAmount + amount },
              { transaction: transaction }
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
