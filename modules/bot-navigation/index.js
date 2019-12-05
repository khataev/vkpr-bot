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
    const menuItem = context.findResponsibleItem(ctx);
    if (!menuItem) return;

    const transitionAllowed = await menuItem.transitionAllowed(ctx);
    if (transitionAllowed) ctx.reply(...(await menuItem.reply(ctx)));
    else {
      menuItem.forbiddenTransitionChatMessage(ctx);
    }
  });

  // debugging
  this.getUrl = async function() {
    const ctx = {
      message: { payload: JSON.stringify({ button: "top_up_rub_button" }) }
    };
    const menuItem = context.findResponsibleItem(ctx);
    const [chatMessage, ...rest] = await menuItem.reply(ctx);
    console.log("chatMessage:", chatMessage);

    // const url = await utils.getPaymentUrl("http:/ya.ru");
    // console.log(url);
  };

  // console.log(context);
};

module.exports = BotNavigation;
