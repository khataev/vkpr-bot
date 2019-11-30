const qs = require("qs");
const axios = require("axios");

const settings = require("./config");

let Utils = function() {
  this.getQiwiPaymentUrl = function(userId) {
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

  this.getShortUrl = async function(url) {
    try {
      const response = await axios.post(
        "https://api.vk.com/method/utils.getShortLink",
        {
          url: url,
          v: "5.103",
          access_token: settings.get("credentials.bot.access_token")
        }
      );
      return response.short_url;
    } catch (error) {
      console.error(error);
      return url;
    }
  };

  this.getPaymentUrl = async function(userId) {
    const url = this.getQiwiPaymentUrl(userId);
    return await this.getShortUrl(url);
  };
};

module.exports = new Utils();
