const Context = require('node-vk-bot-api/lib/context');

function ctx(bot, session, type, message) {
  const ctx = new Context(
    // TODO: move to common library (fixtures)
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
  ctx.session = session;

  return ctx;
}

module.exports = ctx;
