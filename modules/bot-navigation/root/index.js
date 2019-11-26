const MenuOption = require("./../menu-option");
const RouletteOption = require("./roulette");

class RootOption extends MenuOption {
  get chatMessage() {
    return "✌ Вы находитесь в главном меню.";
  }

  get menu() {
    return [[new RouletteOption(this.ctx, this)]];
  }

  get triggerButton() {
    return "root_button";
  }
}

module.exports = RootOption;
