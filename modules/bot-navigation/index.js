const RootOption = require("./root/index");
const Context = require("./context");
const utils = require("./../utils");

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", async ctx => {
    ctx.reply(...(await rootOption.reply(ctx)));
    await context.findOrCreateAccount(ctx);
  });

  rootOption.registerReplies();

  bot.on(async ctx => {
    const reply = context.findReply(ctx);
    if (reply) ctx.reply(...(await reply));
  });

  this.getUrl = async function() {
    const ctx = {
      message: { payload: JSON.stringify({ button: "top_up_rub_button" }) }
    };
    const reply = context.findReply(ctx);
    const [chatMessage, ...rest] = await reply;
    console.log("chatMessage:", chatMessage);

    // const url = await utils.getPaymentUrl("http:/ya.ru");
    // console.log(url);
  };

  // console.log(context);
};

module.exports = BotNavigation;
