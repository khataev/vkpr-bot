const express = require('express');
const bodyParser = require('body-parser');

// local files
const constants = require('./modules/constants');
const logger = require('./modules/logger');
const settings = require('./modules/config');
const packageInfo = require('./package.json');

function start_express_server() {
  if (settings.get('env') === 'production') {
    logger.warn('start_express_server');
    let app = express(),
      group_id = 176672923;

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
      res.json({ version: packageInfo.version });
    });

    app.post(`/${group_id}`, function (req, res) {
      logger.info(req.body);
      // res.send('60df2360');
    });
    //
    // app.post(`/${tomorrow_token}`, function (req, res) {
    //   handleSeizeButton(req, res, 'tomorrow');
    // });

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

run();