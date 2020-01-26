const setupHandlers = require('./setup-handlers');

class BotNavigation {
  static initialize(bot) {
    const { startHandler, registerReplies, mainHandler } = setupHandlers(bot);

    bot.command('начать', startHandler);

    registerReplies();

    bot.on(mainHandler);
  }
}

module.exports = BotNavigation;
