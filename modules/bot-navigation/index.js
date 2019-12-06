const RootOption = require("./root/index");
const Context = require("./context");
const RubFinances = require("./../rub-finances");
const rubFinances = new RubFinances(null);
const utils = require("./../utils");

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", async ctx => {
    ctx.reply(...(await rootOption.reply(ctx)));
    await context.findOrCreateAccount(ctx);
  });

  rootOption.registerReplies();

  // TODO: refactor
  bot.on(async ctx => {
    const vkId = context.getUserId(ctx);
    // check for chat message reply from user
    const chattedContext = ctx.session.chattedContext || {};
    if (chattedContext.chatAllowed) {
      if (chattedContext.withdrawRub) {
        const phoneNumber = ctx && ctx.message && ctx.message.text;
        if (/^79\d{9}$/.test(phoneNumber)) {
          // TODO: withdraw to QIWI
          // TODO: put response url in settings
          const account = await context.findOrCreateAccount(ctx);
          const accountBalance = account.rubAmount;
          const isWithdrawSucceeded = await rubFinances.withdrawMoney(
            account,
            phoneNumber
          );

          if (isWithdrawSucceeded) {
            const message = `
            ✔ Мы отправили на QIWI кошелёк +${phoneNumber} ${accountBalance} ₽!

            📈 Оставьте свой отзыв: vk.com/topic-xxxxxxxxx
            `;
            bot.sendMessage(vkId, message);
            // reset chatted context after processing it
            ctx.session.chattedContext = {};
          } else {
            const message = `
            ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
            `;
            bot.sendMessage(vkId, message);
          }

          // TODO: save phone number for further withdraw?

          // ❗ Произошла ошибка при выводе средств, свяжитесь с администратором.
        } else {
          bot.sendMessage(vkId, "Неверный формат телефона");
        }
      }

      return;
    }

    // menu navigation response
    const menuItem = context.findResponsibleItem(ctx);
    if (!menuItem) return;

    const transitionAllowed = await menuItem.transitionAllowed(ctx);
    if (transitionAllowed) {
      await menuItem.beforeReply(ctx);
      ctx.reply(...(await menuItem.reply(ctx)));
    } else {
      // HINT: negative scenario could be played via negative reply?
      bot.sendMessage(vkId, menuItem.forbiddenTransitionChatMessage(ctx));
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
