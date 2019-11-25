const MenuOption = require("./menu-option");

class BackMenuOption extends MenuOption {
  buttonMarkup(ctx) {
    return Markup.button("📤 Назад", "primary");
  }

  activate() {
    this.parent.activate();
  }
}

module.exports = BackMenuOption;
