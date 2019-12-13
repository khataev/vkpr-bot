const express = require("express");
const bodyParser = require("body-parser");

// local files
const constants = require("./modules/constants");
const logger = require("./modules/logger");
const settings = require("./modules/config");
const packageInfo = require("./package.json");
const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");
const BotNavigation = require("./modules/bot-navigation");
const RubFinances = require("./modules/rub-finances");
const rubFinances = new RubFinances(logger);
const CoinFinances = require("./modules/coin-finances");
const coinFinances = new CoinFinances(logger);

let bot;

function start_express_server() {
  if (settings.get("env") === "production") {
    logger.warn("start_express_server");
    let app = express(),
      groupId = settings.get("credentials.vk.group_id");

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/", function(req, res) {
      res.json({ version: packageInfo.version });
    });

    configureQiwiHook(app, groupId);
    configureVkCoinHook(app, groupId);
    // configureRootHook(app, groupId);

    // app.post(`/${group_id}`, function (req, res) {
    //   logger.info(req.body);
    //   // process_event(req.body);
    //   // res.send('60df2360');
    // });
    //
    // app.post(`/${tomorrow_token}`, function (req, res) {
    //   handleSeizeButton(req, res, 'tomorrow');
    // });

    if (settings.get("credentials.bot.use_webhooks")) {
      logger.info("BOT mode: webhooks");
      bot = configure_bot_webhooks(app, groupId);
    } else {
      logger.info("BOT mode: long polling");
      bot = configure_bot_polling(app, groupId);
    }

    let server = app.listen(process.env.PORT || 8888, function() {
      let host = server.address().address;
      let port = server.address().port;

      console.log(`Server started at http://${host}:${port}`);
    });
  }
}

function run() {
  start_express_server();
}

function process_event(event_data) {
  if (!processable_event(event_data)) return;

  let text = event_data.object.text.toLowerCase().trim();
  if (text == "начать") {
    bot_menu();
  }
}

function processable_event(event_data) {
  logger.debug("Checking event source");
  return (
    event_data &&
    event_data.object &&
    event_data.group_id == settings.get("credentials.vk.group_id") &&
    event_data.secret === settings.get("credentials.vk.secret")
  );
}

// function cmd_menu_text() {
//   let menu = `
//     /список - получить актуальный список.
//     /правила - получение правил списка.
//     /группы - получить список групп для пиара предпоследнем сообщении в бесед".
//     /стата - получить свою статистику (если можно то каждые 3 мин).
//     /проверка - проверяет текущего пользователя на добавление всех участников списка.
//     /меню - показать это меню.
//   `;

//   return menu;
// }

// function cmd_list_text() {
//   return "Здесь будет список";
// }

function configure_bot_webhooks(app, group_id) {
  let bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: settings.get("credentials.vk.group_id"),
    secret: settings.get("credentials.vk.secret"),
    confirmation: settings.get("credentials.vk.confirmation")
  });
  configure_bot(bot);

  app.post(`/${group_id}`, bot.webhookCallback);
  // app.post('/', bot.webhookCallback);

  return bot;
}

function configure_bot_polling(app, group_id) {
  let bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: settings.get("credentials.vk.group_id")
  });

  configure_bot(bot);
  bot.startPolling();

  return bot;
}

function configure_bot(bot) {
  // TODO: refactor start: constructor to method call
  const session = new Session();
  bot.use(session.middleware());
  nav = new BotNavigation(bot);
}

function configureQiwiHook(app, groupId) {
  app.post(`/${groupId}/rubHandler`, async function(req, res) {
    logger.debug("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await rubFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
  });
}

function configureVkCoinHook(app, groupId) {
  app.post(`/${groupId}/coinHandler`, async function(req, res) {
    logger.debug("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await coinFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
  });
}

// for debug. use it for debugging vk api messages
function configureRootHook(app, groupId) {
  app.post(`/${groupId}`, async function(req, res) {
    logger.debug("root handler action");
    console.log(req.body);
    res.sendStatus(200);
  });
}

async function debug_run() {
  const Account = require("./db/models").Account;

  bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: settings.get("credentials.vk.group_id")
  });
  nav = new BotNavigation(bot);
  // await nav.getUrl();

  // const account = await Account.findOne({ where: { vkId: "" } });
  // await rubFinances.withdrawMoney(account, "");
}

// debug_run();

run();
