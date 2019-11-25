const qs = require("qs");

const settings = require("./config");

let Utils = function() {
  this.getPaymentLink = function(userId) {
    const baseUrl = "https://qiwi.com/payment/form/99";
    const account_number = settings.get("credentials.qiwi.account_number");

    params = qs.stringify({
      currency: "RUB",
      amountFraction: 0,
      extra: { "'comment'": userId, "'account'": account_number },
      amountInteger: 5,
      blocked: ["comment", "account"]
    });

    return `${baseUrl}?${params}`;
  };
};

module.exports = new Utils();
