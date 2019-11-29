const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class ReserveOption extends MenuOption {
  chatMessage(botCtx) {
    // TODO:
    return `
    💸 Резерв QIWI: 3073.43 ₽
    💸 Резерв VK Coins: 1 002 208 549,734
    `;
  }

  get buttonMarkup() {
    return Markup.button("💸 Резерв", "primary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "reserve_button";
  }
}

module.exports = ReserveOption;
