// const Markup = require("node-vk-bot-api/lib/markup");
const RootOption = require("./root/index");
const Context = require("./context");

let startCommandText = function(ctx) {
  return "Добро пожаловать, для взаимодействия с ботом, используйте отправленную нижу клавиатуру. Инструкция - https://vk.com/@vkcoinqitix-instrukciya-po-pokupkeprodazhe-vkcoin";
};

let rootMenuMarkup = function(parent) {
  // return Markup.keyboard([
  //   [Markup.button("🎰 Рулетка", "secondary", { button: "roulette" })],
  //   [
  //     Markup.button("💶 Пополнить VK Coin", "positive"),
  //     Markup.button("💶 Пополнить RUB", "positive")
  //   ],
  //   [
  //     Markup.button("📤 Вывести VK Coin", "negative"),
  //     Markup.button("📤 Вывести RUB", "negative")
  //   ],
  //   [
  //     Markup.button("💱 Обменять VK Coin", "primary"),
  //     Markup.button("💱 Обменять RUB", "primary")
  //   ],
  //   [
  //     Markup.button("💰 Баланс", "secondary"),
  //     Markup.button("📊 Курс / Информация", "secondary")
  //   ],
  //   [Markup.button("💸 Резерв", "primary")]
  // ]);
  // [
  //   [roultteOption],
  //   [option2, option3],
  //   [option4, option5],
  //   [option6, option7],
  //   [option8, option9],
  //   [option10]
  // ];
};

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", ctx => {
    // ctx.reply(
    //   "Добро пожаловать, для взаимодействия с ботом, используйте отправленную нижу клавиатуру. Инструкция - https://vk.com/@vkcoinqitix-instrukciya-po-pokupkeprodazhe-vkcoin",
    //   null,
    //   Markup.keyboard([
    //     [Markup.button("🎰 Рулетка", "secondary", { button: "roulette" })],
    //     [
    //       Markup.button("💶 Пополнить VK Coin", "positive"),
    //       Markup.button("💶 Пополнить RUB", "positive")
    //     ],
    //     [
    //       Markup.button("📤 Вывести VK Coin", "negative"),
    //       Markup.button("📤 Вывести RUB", "negative")
    //     ],
    //     [
    //       Markup.button("💱 Обменять VK Coin", "primary"),
    //       Markup.button("💱 Обменять RUB", "primary")
    //     ],
    //     [
    //       Markup.button("💰 Баланс", "secondary"),
    //       Markup.button("📊 Курс / Информация", "secondary")
    //     ],
    //     [Markup.button("💸 Резерв", "primary")]
    //   ])
    // );

    // [message, attachment, markup] = rootOption.reply;
    // console.log(message);
    // console.log(attachment);
    // console.log(markup);
    ctx.reply(...rootOption.reply);
    // ctx.reply(message, attachment, markup);
  });

  // bot.on(ctx => {
  //   console.log(ctx);
  //   ctx.reply(
  //     cmd_roulette(),
  //     null,
  //     Markup.keyboard([
  //       Markup.button("🤑 Low Coin", "positive"),
  //       Markup.button("💳 Medium...", "negative"),
  //       Markup.button("📤 Назад", "primary")
  //     ])
  //   );
  // });

  rootOption.registerReplies();

  bot.on(ctx => {
    const reply = context.findReply(ctx);
    if (reply) {
      console.log("bot navigation. found reply", reply);
      ctx.reply(...reply);
    }
  });

  // console.log(context);
};

module.exports = BotNavigation;
