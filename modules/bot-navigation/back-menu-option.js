const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('./menu-option');
// TODO: each menu has its own BackMenu - this should go into roulette or become base class
class BackMenuOption extends MenuOption {
  chatMessage(botCtx) {
    // return "📤 Назад";
    return this.parent.parent.chatMessage(botCtx);
  }

  markup(botCtx) {
    // TODO: refactor double parent into handy method
    return this.parent.parent.markup(botCtx);
  }

  // TODO: refactor
  get buttonMarkup() {
    return Markup.button('📤 Назад', 'primary', {
      button: this.triggerButton
    });
  }

  // TODO: possibly, need to override (for different back buttons)
  get triggerButton() {
    return 'return_to_root_button';
  }
}

module.exports = BackMenuOption;
