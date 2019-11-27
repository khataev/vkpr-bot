const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("./../../menu-option");

class BackMenuOption extends MenuOption {
  get chatMessage() {
    return this.parent.parent.chatMessage;
  }

  // TODO: refactor
  get buttonMarkup() {
    return Markup.button("✌ Назад", "primary", {
      button: this.triggerButton
    });
  }

  // TODO: possibly, need to override (for different back buttons)
  get triggerButton() {
    return "return_to_root_1_button";
  }

  get markup() {
    // TODO: refactor double parent into handy method
    return this.parent.parent.markup;
  }
}

module.exports = BackMenuOption;
