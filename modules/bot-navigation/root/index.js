const MenuOption = require("./../menu-option");
const RouletteOption = require("./roulette");
const TopUpCoinOption = require("./top-up-coin-option");
const TopUpRubOption = require("./top-up-rub");

class RootOption extends MenuOption {
  get chatMessage() {
    return "✌ Вы находитесь в главном меню.";
  }

  // TODO: do we need 2 params in ctor: (this.ctx, this)?
  get menu() {
    return [
      [new RouletteOption(this.ctx, this)],
      [new TopUpCoinOption(this.ctx, this), new TopUpRubOption(this.ctx, this)]
    ];
  }

  get triggerButton() {
    return "root_button";
  }
}

module.exports = RootOption;
