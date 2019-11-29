const models = require("./../../db/models");
const Account = models.Account;

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

  createAccount(botCtx) {
    const userId = this.getUserId(botCtx);
    return Account.create({ vkId: userId });
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

  findReply(botCtx) {
    // console.log("Context#findReply. botCtx:", botCtx);
    console.log(
      "Context#findReply. payloadButton:",
      this.payloadButton(botCtx)
    );
    if (this.replies[this.payloadButton(botCtx)])
      console.log("Context#findReply. reply found");

    const replyMenuItem = this.replies[this.payloadButton(botCtx)];
    return replyMenuItem.reply(botCtx);
  }

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
