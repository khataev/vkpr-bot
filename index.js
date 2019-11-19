const express = require('express');
const bodyParser = require('body-parser');

// local files
const constants = require('./modules/constants');
const logger = require('./modules/logger');
const settings = require('./modules/config');
const packageInfo = require('./package.json');
const VkBot = require('node-vk-bot-api');

let bot;

function start_express_server() {
  if (settings.get('env') === 'production') {
    logger.warn('start_express_server');
    let app = express(),
      group_id = settings.get('credentials.vk.group_id');

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
      res.json({ version: packageInfo.version });
    });

    // app.post(`/${group_id}`, function (req, res) {
    //   logger.info(req.body);
    //   // process_event(req.body);
    //   // res.send('60df2360');
    // });
    //
    // app.post(`/${tomorrow_token}`, function (req, res) {
    //   handleSeizeButton(req, res, 'tomorrow');
    // });

    if (settings.get('credentials.bot.use_webhooks')) {
      logger.info('BOT mode: webhooks');
      bot = configure_bot_webhooks(app, group_id);
    }
    else {
      logger.info('BOT mode: long polling');
      bot = configure_bot_polling(app, group_id);
    }

    let server = app.listen(process.env.PORT || 8888, function () {
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
  if (!processable_event(event_data))
    return;

  let text = event_data.object.text.toLowerCase().trim();
  if (text == 'начать') {
    bot_menu();
  }
}

function processable_event(event_data) {
  logger.debug('Checking event source');
  return event_data &&
    event_data.object &&
    event_data.group_id == settings.get('credentials.vk.group_id') &&
    event_data.secret === settings.get('credentials.vk.secret');
}

function cmd_menu_text() {
  let menu = `
    /список - получить актуальный список.
    /правила - получение правил списка.
    /группы - получить список групп для пиара предпоследнем сообщении в бесед".
    /стата - получить свою статистику (если можно то каждые 3 мин).
    /проверка - проверяет текущего пользователя на добавление всех участников списка.
    /меню - показать это меню.
  `;

  return menu;
}

function cmd_list_text() {
  return 'Здесь будет список';
}

function cmd_rules_text() {
  let rules = `
  🎄🎄🎄 Правила списка 🎄🎄🎄 
  ❄ Новенькие должны добавить всех участников списка!
  ❄ Как пиарить: https://vk.cc/8mtPEz 
  ❄ Чистка каждый день, в 20:00 по Московскому времени. 
  ❄ После чистки ваше количество постов обнуляется. 
  ❄ Пиар в комментариях учитывается только под последними 5 постами от имени группы. При этом доля комментариев от общего числа постов не должна превышать 30%.
  🎉Вы можете получить 40 постов за рассылку приглашений в группу. Для начисления постов предоставьте скриншот лимита одному из администраторов. 
  🤖 В беседе работает бот. 
  🔹 Для получения актуального пиар-списка используйте команду /list. Рекомендуем копировать список на специальной странице, ссылку на которую можно получить при помощи /list link. 
  🔹 Для получения списка групп используйте команду /groups.
  🔹 Для просмотра своей статистики, используйте команду /stat.
  🔹 Вы можете ознакомиться со списком всех доступных команд, используя команду /help. 
  ⚠ Запрещено: 
  ❌ 1. Оскорблять других участников списка.
  ❌ 2. Просить вступить в группы. 
  ❌ 3. Рекламировать в беседе другие пиар-списки. 
  ❌ 4. Просить лайки.
  ❌ 5. Использовать команды для бота слишком часто. Обращайтесь к боту лишь при необходимости, не засоряйте беседу командами просто так. 
  ⚡ 100 постов в день — норма пиара. 
  🔥 350 постов в день — VIP.
  `;
  return rules;
}

function cmd_groups_text() {
  return 'Здесь будет список групп';
}

function cmd_stats_text() {
  return 'Здесь будет статистика';
}

function cmd_check_text() {
  return 'Здесь будут результаты проверки';
}

function configure_bot_webhooks(app, group_id) {
  let bot = new VkBot({
    token: settings.get('credentials.bot.access_token'),
    group_id: settings.get('credentials.vk.group_id'),
    secret: settings.get('credentials.vk.secret'),
    confirmation: settings.get('credentials.vk.confirmation')
  });
  configure_bot(bot);

  app.post(`/${group_id}`, bot.webhookCallback);
  // app.post('/', bot.webhookCallback);

  return bot;
}

function configure_bot_polling(app, group_id) {
  let bot = new VkBot({
    token: settings.get('credentials.bot.access_token'),
    group_id: settings.get('credentials.vk.group_id')
  });

  configure_bot(bot);
  bot.startPolling();

  return bot;
}

function configure_bot(bot) {
  bot.command('/меню', (ctx) => {
    ctx.reply(cmd_menu_text());
  });

  bot.command('/список', (ctx) => {
    ctx.reply(cmd_list_text());
  });

  bot.command('/правила', (ctx) => {
    ctx.reply(cmd_rules_text());
  });

  bot.command('/группы', (ctx) => {
    ctx.reply(cmd_groups_text());
  });

  bot.command('/стата', (ctx) => {
    ctx.reply(cmd_stats_text());
  });

  bot.command('/проверка', (ctx) => {
    ctx.reply(cmd_check_text());
  });

  bot.on((ctx) => {
    ctx.reply('Узнать, чем могу быть полезен можно командой /меню');
  });
}

run();