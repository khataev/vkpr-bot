require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");

// local files
const settings = require("./modules/config");
const packageInfo = require("./package.json");
const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");
const BotNavigation = require("./modules/bot-navigation");
const rubFinances = require("./modules/rub-finances");
const coinFinances = require("./modules/coin-finances");

let bot;

function start_express_server() {
  if (settings.get("env") === "production") {
    console.warn("start_express_server");
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

    if (settings.get("credentials.bot.use_webhooks")) {
      console.info("BOT mode: webhooks");
      bot = configure_bot_webhooks(app, groupId);
    } else {
      console.info("BOT mode: long polling");
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
    console.log("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await rubFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
  });
}

function configureVkCoinHook(app, groupId) {
  app.post(`/${groupId}/coinHandler`, async function(req, res) {
    console.log("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await coinFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
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
