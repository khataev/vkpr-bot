const settings = require("@modules/config");
const Context = require("@bot-navigation/context");
const VkBot = require("node-vk-bot-api");
const bot = new VkBot({
  token: settings.get("credentials.bot.access_token"),
  group_id: settings.get("credentials.vk.group_id"),
  secret: settings.get("credentials.vk.secret"),
  confirmation: settings.get("credentials.vk.confirmation")
});
const context = new Context(bot);
function dummyBotCtx(userId) {
  return { message: { from_id: userId } };
}

module.exports = { bot, context, dummyBotCtx };
