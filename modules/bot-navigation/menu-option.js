const Markup = require("node-vk-bot-api/lib/markup");

class MenuOption {
  constructor(ctx, parent) {
    this.ctx = ctx;
    this.parent = parent;
  }

  get isRoot() {
    return !!this.parent;
  }

  get chatMessage() {
    throw Error("Must be implemented in child class");
  }

  get buttonMarkup() {
    throw Error("Must be implemented in child class");
  }

  get menu() {
    throw Error("Must be implemented in child class");
  }

  get commandText() {
    throw Error("Must be implemented in child class");
  }

  get markup() {
    return Markup.keyboard(this.buildMarkup(this.menu));
  }

  get reply() {
    return [this.chatMessage, null, this.markup];
  }

  activate() {
    this.chatMessage;
  }

  command() {
    this.ctx.bot.command(this.command, botCtx => {
      botCtx.reply(this.reply);
    });
  }

  registerCommands() {
    if (!isRoot) return;
  }

  registerCommand(element) {
    if (element instanceof Array)
      return element.forEach(el => {
        this.registerCommand(el);
      });

    return;
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
