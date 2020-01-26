const Markup = require('node-vk-bot-api/lib/markup');
const MenuOption = require('../../menu-option');
const BackMenuOption = require('./back-menu-option');

class SendMessage extends MenuOption {
  async chatMessage() {
    return `
    Введите сообщение для рассылки
    `;
  }

  async beforeReply(botCtx) {
    botCtx.session.chattedContext = {
      chatAllowed: true,
      sendMessage: true
    };
  }

  get buttonMarkup() {
    return Markup.button('📨 Послать сообщение', 'primary', {
      button: this.triggerButton
    });
  }

  menu() {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return 'send_message_button';
  }
}

module.exports = SendMessage;
