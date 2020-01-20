const { url, logging, mainConfig } = require('./common-settings');

const urlConfig = { use_env_variable: 'DATABASE_URL', logging };

module.exports = url ? urlConfig : mainConfig;
