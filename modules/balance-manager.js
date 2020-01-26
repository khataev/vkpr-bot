const axios = require('axios');
const settings = require('./config');

class BalanceManager {
  async getRubBalance() {
    const baseUrl = settings.get('credentials.qiwi.balance_url');
    const accountNumber = settings.get('credentials.qiwi.account_number');
    const url = `${baseUrl}/${accountNumber}/accounts`;
    const accessToken = settings.get('credentials.qiwi.access_token');

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
    const url = settings.get('credentials.vk_coin.balance_url');
    const accessToken = settings.get('credentials.vk_coin.access_token');
    const merchantId = settings.get('credentials.vk_coin.account_number');
    const params = {
      merchantId,
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

module.exports = new BalanceManager();
