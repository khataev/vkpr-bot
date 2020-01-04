require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");

// local files
const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");
const BotNavigation = require("./modules/bot-navigation");
const rubFinances = require("./modules/rub-finances");
const coinFinances = require("./modules/coin-finances");
const settings = require("./modules/config");
const packageInfo = require("./package.json");

// let bot;

function configureBot(bot) {
  // TODO: refactor start: constructor to method call
  const session = new Session();
  bot.use(session.middleware());
  BotNavigation.initialize(bot);
}

function configureBotPolling(app, groupId) {
  const bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: groupId
  });

  configureBot(bot);
  bot.startPolling();

  return bot;
}

function configureBotWebhooks(app, groupId) {
  const bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: groupId,
    secret: settings.get("credentials.vk.secret"),
    confirmation: settings.get("credentials.vk.confirmation")
  });
  configureBot(bot);

  app.post(`/${groupId}`, bot.webhookCallback);
  // app.post('/', bot.webhookCallback);

  return bot;
}

function configureQiwiHook(app, groupId) {
  app.post(`/${groupId}/rubHandler`, async function rubHandler(req, res) {
    console.log("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await rubFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
  });
}

function configureVkCoinHook(app, groupId) {
  app.post(`/${groupId}/coinHandler`, async function coinHandler(req, res) {
    console.log("handler action");
    console.log(req.body);
    // res.sendStatus(200);

    const success = await coinFinances.processWebHook(req.body);
    if (success) res.sendStatus(200);
    else res.sendStatus(422);
  });
}

function startExpressServer() {
  if (settings.get("env") === "production") {
    console.warn("start_express_server");
    const app = express();
    const groupId = settings.get("credentials.vk.group_id");

    // Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/", function rootHandler(req, res) {
      res.json({ version: packageInfo.version });
    });

    configureQiwiHook(app, groupId);
    configureVkCoinHook(app, groupId);

    if (settings.get("credentials.bot.use_webhooks")) {
      console.info("BOT mode: webhooks");
      configureBotWebhooks(app, groupId);
    } else {
      console.info("BOT mode: long polling");
      configureBotPolling(app, groupId);
    }

    const server = app.listen(process.env.PORT || 8888, function listen() {
      const { address, port } = server.address();

      console.log(`Server started at http://${address}:${port}`);
    });
  }
}

function run() {
  startExpressServer();
}

// eslint-disable-next-line no-unused-vars
async function debugRun() {
  const bot = new VkBot({
    token: settings.get("credentials.bot.access_token"),
    group_id: settings.get("credentials.vk.group_id")
  });
  BotNavigation.initialize(bot);
}

// debugRun();

run();
