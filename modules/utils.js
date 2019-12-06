const qs = require("qs");
const axios = require("axios");

const settings = require("./config");

let Utils = function() {
  this.getQiwiPaymentUrl = function(userId) {
    const baseUrl = settings.get("credentials.qiwi.payment_url");
    const accountNumber = settings.get("credentials.qiwi.account_number");

    params = qs.stringify({
      currency: "RUB",
      amountFraction: 0,
      extra: { "'comment'": userId, "'account'": accountNumber },
      amountInteger: 5,
      blocked: ["comment", "account"]
    });

    return `${baseUrl}?${params}`;
  };

  this.getShortUrl = async function(url) {
    try {
      const accessToken = settings.get("credentials.bot.access_token");
      const shortLinkUrl = settings.get("credentials.vk.utils_short_link_url");
      data = qs.stringify({
        url: url,
        v: "5.103",
        access_token: accessToken
      });
      const response = await axios.post(shortLinkUrl, data);
      if (response.data.error)
        throw new Error(
          `${response.data.error.error_code}: ${response.data.error.error_msg}`
        );

      return response.data.response.short_url;
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
