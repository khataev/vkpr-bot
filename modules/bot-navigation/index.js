const RootOption = require("./root/index");
const Context = require("./context");

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", async ctx => {
    ctx.reply(...(await rootOption.reply(ctx)));
    if (!(await context.hasAccount(ctx))) await context.createAccount(ctx);
  });

  rootOption.registerReplies();

  bot.on(async ctx => {
    const reply = context.findReply(ctx);
    if (reply) ctx.reply(...(await reply));
  });

  // console.log(context);
};

module.exports = BotNavigation;
