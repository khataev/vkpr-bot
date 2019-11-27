class Context {
  constructor(bot) {
    this.bot = bot;
    this.replies = {};
  }

  isPositiveBalance() {
    return false;
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
    return this.replies[this.payloadButton(botCtx)];
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
    this.replies[menuOption.triggerButton] = menuOption.reply;
  }
}

module.exports = Context;
