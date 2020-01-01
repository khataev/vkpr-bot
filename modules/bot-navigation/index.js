const RootOption = require("./root/index");
const Context = require("./context");
const rubFinances = require("./../rub-finances");
const settings = require("./../config"); // get from context
const balanceManager = require("./../balance-manager");
const models = require("./../../db/models");
const ExchangeRate = models.ExchangeRate;
const numberFormatter = require("./../number-formatter");

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", async ctx => {
    ctx.reply(...(await rootOption.reply(ctx)));
    await context.findOrCreateAccount(ctx);
    rootOption.registerReplies(ctx);
  });

  // TODO: refactor
  const adminId = settings.get("shared.admins")[0] || 0;
  rootOption.registerReplies({ message: { from_id: adminId } });

  // TODO: refactor
  bot.on(async ctx => {
    // HINT: beforeReply FIRST (maybe could improve?)
    // in order to cancel chat (back button)
    const menuItem = context.findResponsibleItem(ctx);
    let transitionAllowed;
    if (menuItem) {
      transitionAllowed = await menuItem.transitionAllowed(ctx);
      if (transitionAllowed) await menuItem.beforeProcess(ctx);
    }

    const vkId = context.getUserId(ctx);
    // check for chat message reply from user
    const chattedContext = ctx.session.chattedContext || {};
    if (chattedContext.chatAllowed) {
      if (chattedContext.withdrawRub) {
        const phoneNumber = ctx && ctx.message && ctx.message.text;
        if (/^79\d{9}$/.test(phoneNumber)) {
          const account = await context.findOrCreateAccount(ctx);
          const accountBalance = account.rubAmountInRub();

          // Проверка на достаточное колиество денег в системе
          const systemBalance = await balanceManager.getRubBalance();
          if (systemBalance < account.rubAmount) {
            context.sendMessageToAdmins(
              `Недостаточно RUB для вывода ${numberFormatter.formatRub(
                accountBalance
              )}`
            );
            message = `
            💱 Недостаточно RUB в системе для вывода!
            `;
            bot.sendMessage(vkId, message);
            return;
          }

          const feedbackUrl = settings.get("shared.feedback_url");
          const isWithdrawSucceeded = await rubFinances.withdrawRub(
            account,
            phoneNumber
          );

          if (isWithdrawSucceeded) {
            const message = `
            ✔ Мы отправили на QIWI кошелёк +${phoneNumber} ${numberFormatter.formatRub(
              accountBalance
            )} ₽!

            📈 Оставьте свой отзыв: ${feedbackUrl}
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
      } else if (chattedContext.setExchangeRate) {
        let canProceed = false;
        const rawText = ctx && ctx.message && ctx.message.text;
        if (!rawText) bot.sendMessage(vkId, "Не передано значение курса");

        const tokens = rawText.split("/");
        if (!tokens.length === 2)
          bot.sendMessage(vkId, "Неверный формат курса");

        try {
          const sellRate = parseInt(tokens[0]);
          const buyRate = parseInt(tokens[1]);
          if (Number.isNaN(sellRate) || Number.isNaN(buyRate))
            bot.sendMessage(vkId, "Передано некорректное число");
          else if (sellRate <= buyRate) {
            canProceed = true;
            bot.sendMessage(
              vkId,
              "Обычно курс продажи должен превышать курс покупки, иначе это экономически не выгодно"
            );
          } else {
            canProceed = true;
          }

          if (canProceed) {
            const isSuccess = await ExchangeRate.setExchangeRate(
              sellRate,
              buyRate
            );
            if (isSuccess) bot.sendMessage(vkId, "Курс успешно установлен");
            else bot.sendMessage(vkId, "Произошла ошибка при установке курса");
          }
        } catch (error) {
          console.error(error.message);
          bot.sendMessage(vkId, "Произошла ошибка при установке курса");
        }
      }

      return;
    }

    // menu navigation response
    // const menuItem = context.findResponsibleItem(ctx);
    if (!menuItem) return;

    // const transitionAllowed = await menuItem.transitionAllowed(ctx);
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
