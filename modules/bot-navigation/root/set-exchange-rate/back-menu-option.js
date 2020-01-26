const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('./../../menu-option');

class BackMenuOption extends MenuOption {
  chatMessage(botCtx) {
    return this.parent.parent.chatMessage(botCtx);
  }

  markup(botCtx) {
    // TODO: refactor double parent into handy method
    return this.parent.parent.markup(botCtx);
  }

  async beforeProcess(botCtx) {
    // TODO: shared function clearChattedContext
    botCtx.session.chattedContext = {};
  }

  // TODO: refactor
  get buttonMarkup() {
    return Markup.button('✌ Назад', 'primary', {
      button: this.triggerButton
    });
  }

  // TODO: possibly, need to override (for different back buttons)
  get triggerButton() {
    return 'return_to_root_3_button';
  }
}

module.exports = BackMenuOption;
