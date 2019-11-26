const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("./menu-option");

class BackMenuOption extends MenuOption {
  get chatMessage() {
    // return "📤 Назад";
    return this.parent.parent.chatMessage;
  }

  // TODO: refactor
  get buttonMarkup() {
    return Markup.button("📤 Назад", "primary", {
      button: this.triggerButton
    });
  }

  // TODO: possibly, need to override (for different back buttons)
  get triggerButton() {
    return "return_to_root_button";
  }

  get markup() {
    // TODO: refactor double parent into handy method
    return this.parent.parent.markup;
  }

  // activate() {
  //   this.parent.activate();
  // }
}

module.exports = BackMenuOption;
