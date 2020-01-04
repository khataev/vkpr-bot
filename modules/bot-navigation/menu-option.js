const Markup = require("node-vk-bot-api/lib/markup");

class MenuOption {
  constructor(ctx, parent) {
    this.ctx = ctx;
    this.parent = parent;
  }

  get isRoot() {
    return !this.parent;
  }

  async chatMessage() {
    throw new Error("Must be implemented in child class");
  }

  forbiddenTransitionChatMessage() {
    throw new Error("Must be implemented in child class");
  }

  async transitionAllowed() {
    return true;
  }

  beforeProcess() {}

  beforeReply() {}

  get buttonMarkup() {
    throw new Error("Must be implemented in child class");
  }

  menu() {}

  // TODO: rename to childMarkup
  // TODO: refactor
  markup(botCtx) {
    if (!this.menu(botCtx)) return null;

    return Markup.keyboard(this.buildMarkup(this.menu(botCtx)));
  }

  async reply(botCtx) {
    return [await this.chatMessage(botCtx), null, this.markup(botCtx)];
  }

  get triggerButton() {
    throw new Error("Must be implemented in child class");
  }

  registerReplies(botCtx) {
    if (!this.isRoot) return;

    this.registerReply(this, botCtx);
  }

  registerReply(menuOption, botCtx) {
    // console.log("MenuOption#registerReply:", menuOption);
    if (menuOption instanceof MenuOption) {
      // console.log(
      //   `MenuOption#registerReply, register: ${menuOption.triggerButton}`
      // );
      this.ctx.registerReply(menuOption);
      this.registerReplyForMenuArray(menuOption.menu(botCtx), botCtx);
    }
  }

  registerReplyForMenuArray(array, botCtx) {
    if (array instanceof Array) {
      array.forEach(el => {
        if (el instanceof Array) this.registerReplyForMenuArray(el, botCtx);
        else this.registerReply(el, botCtx);
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
