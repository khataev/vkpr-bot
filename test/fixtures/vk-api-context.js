const Context = require('node-vk-bot-api/lib/context');

function ctx(bot, session, type, message) {
  const context = new Context(
    {
      type,
      object: {
        from_id: 1,
        // TODO: move to 5.103
        text: message, // HINT: for api below 5.103
        message: {
          text: message
        },
        client_info: {
          keyboard: true
        }
      },
      group_id: 1,
      event_id: '1234567890'
    },
    bot
  );
  context.session = session;

  return context;
}

module.exports = ctx;
