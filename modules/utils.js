const axios = require("axios");
const qs = require("qs");
const settings = require("./config");

let Utils = function() {
  // shorten url with vk api
  this.shortenUrl = async function(url) {
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
};

module.exports = new Utils();
