const MenuOption = require("./../menu-option");
const RouletteOption = require("./roulette");
const TopUpCoinOption = require("./top-up-coin-option");
const TopUpRubOption = require("./top-up-rub");
const WithdrawCoinOption = require("./withdraw-coin-option");
const WithdrawRubOption = require("./withdraw-rub");
const ExchangeCoinOption = require("./exchange-coin-option");
const ExchangeRubOption = require("./exchange-rub-option");
const BalanceCoinOption = require("./balance-option");
const InfoOption = require("./info-option");
const ReserveOption = require("./reserve-option");
const SetExchangeRateOption = require("./set-exchange-rate");

class RootOption extends MenuOption {
  chatMessage(botCtx) {
    return "✌ Вы находитесь в главном меню.";
  }

  // TODO: do we need 2 params in ctor: (this.ctx, this)?
  menu(botCtx) {
    return [
      // [new RouletteOption(this.ctx, this)],
      [new TopUpCoinOption(this.ctx, this), new TopUpRubOption(this.ctx, this)],
      [
        new WithdrawCoinOption(this.ctx, this),
        new WithdrawRubOption(this.ctx, this)
      ],
      [
        new ExchangeCoinOption(this.ctx, this),
        new ExchangeRubOption(this.ctx, this)
      ],
      [new BalanceCoinOption(this.ctx, this), new InfoOption(this.ctx, this)],
      [new ReserveOption(this.ctx, this)],
      // TODO: only for admin
      [new SetExchangeRateOption(this.ctx, this)]
    ];
  }

  get triggerButton() {
    return "root_button";
  }
}

module.exports = RootOption;
