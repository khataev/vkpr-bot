const models = require("./../../db/models");
const Account = models.Account;
const AggregatedInfo = models.AggregatedInfo;

class Context {
  constructor(bot) {
    this.bot = bot;
    this.replies = {};
  }

  isPositiveBalance() {
    return false;
  }

  hasAccount(botCtx) {
    const userId = this.getUserId(botCtx);
    return Account.findOne({ where: { vkId: userId } });
  }

  async findOrCreateAccount(botCtx) {
    return (
      (await this.hasAccount(botCtx)) || (await this.createAccount(botCtx))
    );
  }

  async createAccount(botCtx) {
    const userId = this.getUserId(botCtx);
    let account;
    await Account.sequelize.transaction({}, async transaction => {
      account = await Account.create(
        { vkId: userId },
        { transaction: transaction }
      );
      await AggregatedInfo.increment({ users: 1 }, { where: {} });
      console.debug(`Account for userId ${userId} created`);
    });
    return account;
  }

  getUserId(botCtx) {
    return botCtx && botCtx.message && botCtx.message.from_id;
  }

  payloadButton(botCtx) {
    return (
      botCtx &&
      botCtx.message &&
      botCtx.message.payload &&
      JSON.parse(botCtx.message.payload).button
    );
  }

  findResponsibleItem(botCtx) {
    // console.log("Context#findResponsibleItem. botCtx:", botCtx);
    console.log(
      "Context#findResponsibleItem. payloadButton:",
      this.payloadButton(botCtx)
    );
    if (this.replies[this.payloadButton(botCtx)])
      console.log("Context#findResponsibleItem. item found");

    return this.replies[this.payloadButton(botCtx)];
  }

  // TODO: rename to registerMenuOption
  registerReply(menuOption) {
    let error;

    if (!menuOption.triggerButton) {
      error = `No triggerButton for menuOption: ${menuOption}`;
    } else if (!menuOption.reply) {
      error = `No reply for menuOption: ${menuOption}`;
    }

    if (error) {
      console.error("errored menuOption:", menuOption);
      throw new Error(error);
    }

    console.log(`Context#registerReply. registered:`, menuOption.triggerButton);
    this.replies[menuOption.triggerButton] = menuOption;
  }
}

module.exports = Context;
