const Markup = require("node-vk-bot-api/lib/markup");

class MenuOption {
  constructor(ctx, parent) {
    this.ctx = ctx;
    this.parent = parent;
  }

  get isRoot() {
    return !this.parent;
  }

  get chatMessage() {
    throw Error("Must be implemented in child class");
  }

  get buttonMarkup() {
    throw Error("Must be implemented in child class");
  }

  get menu() {
    return;
  }

  get commandText() {
    throw Error("Must be implemented in child class");
  }

  // TODO: rename to childMarkup
  get markup() {
    if (!this.menu) return;
    return Markup.keyboard(this.buildMarkup(this.menu));
  }

  get reply() {
    return [this.chatMessage, null, this.markup];
  }

  get triggerButton() {
    throw Error("Must be implemented in child class");
  }

  // command() {
  //   this.ctx.bot.command(this.command, botCtx => {
  //     botCtx.reply(this.reply);
  //   });
  // }

  registerReplies() {
    if (!this.isRoot) return;

    this.registerReply(this);
  }

  registerReply(menuOption) {
    // console.log("MenuOption#registerReply:", menuOption);
    if (menuOption instanceof MenuOption) {
      // console.log(
      //   `MenuOption#registerReply, register: ${menuOption.triggerButton}`
      // );
      this.ctx.registerReply(menuOption);
      this.registerReplyForMenuArray(menuOption.menu);
    }
  }

  registerReplyForMenuArray(array) {
    if (array instanceof Array) {
      array.forEach(el => {
        if (el instanceof Array) this.registerReplyForMenuArray(el);
        else this.registerReply(el);
      });
    }
  }

  buildMarkup(element) {
    if (element instanceof Array)
      return element.map(el => {
        return this.buildMarkup(el);
      });

    return element.buttonMarkup;
  }
}

module.exports = MenuOption;
