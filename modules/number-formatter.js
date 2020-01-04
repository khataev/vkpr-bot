const numeral = require('numeral');

class NumberFormatter {
  constructor() {
    this.locale = {
      delimiters: {
        thousands: ' ',
        decimal: '.'
      }
    };

    numeral.register('locale', 'ru', this.locale);
    numeral.locale('ru');
  }

  formatCoin(number) {
    return numeral(number).format('0,0.000');
  }

  formatRub(number) {
    return numeral(number).format('0,0.00');
  }
}

module.exports = new NumberFormatter();
