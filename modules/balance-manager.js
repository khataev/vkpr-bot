const axios = require("axios");

const gLogger = require("./logger"); // TODO: get from context
const gSettings = require("./config");

class BalanceManager {
  constructor(logger) {
    this.logger = logger || gLogger;
  }

  async getRubBalance() {
    const baseUrl = gSettings.get("credentials.qiwi.balance_url");
    const accountNumber = gSettings.get("credentials.qiwi.account_number");
    const url = `${baseUrl}/${accountNumber}/accounts`;
    const accessToken = gSettings.get("credentials.qiwi.access_token");

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      return response.data.accounts[0].balance.amount * 100;
    } catch (error) {
      console.error(error.message);

      return 0;
    }
  }

  async getCoinBalance() {
    const url = gSettings.get("credentials.vk_coin.balance_url");
    const accessToken = gSettings.get("credentials.vk_coin.access_token");
    const merchantId = gSettings.get("credentials.vk_coin.account_number");
    const params = {
      merchantId: merchantId,
      key: accessToken,
      userIds: [merchantId]
    };

    try {
      const response = await axios.post(url, params);

      return response.data.response[merchantId];
    } catch (error) {
      console.error(error.message);

      return 0;
    }
  }
}

module.exports = BalanceManager;
