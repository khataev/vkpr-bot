const convict = require("convict");

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  db: {
    username: {
      doc: "username",
      format: String,
      default: "",
      env: "DATABASE_USERNAME"
    },
    password: {
      doc: "password",
      format: String,
      default: "",
      env: "DATABASE_PASSWORD"
    },
    database: {
      doc: "database",
      format: String,
      default: "",
      env: "DATABASE_DATABASE"
    },
    host: {
      doc: "host",
      format: String,
      default: "127.0.0.1",
      env: "DATABASE_HOST"
    },
    dialect: {
      doc: "dialect",
      format: String,
      default: "postgres",
      env: "DATABASE_DIALECT"
    },
    url: {
      doc: "url",
      format: String,
      default: "",
      env: "DATABASE_URL"
    }
  },
  credentials: {
    bot: {
      access_token: {
        doc: "Access token for bot",
        format: String,
        default: "",
        env: "CREDENTIALS_BOT_ACCESS_TOKEN"
      },
      use_webhooks: {
        doc: "Webhooks or Long polling (default)",
        format: Boolean,
        default: false,
        env: "CREDENTIALS_BOT_USE_WEBHOOKS"
      }
    },
    vk: {
      group_id: {
        doc: "Id of a Group bot is bound to",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_GROUP_ID"
      },
      secret: {
        doc: "Secret key",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_SECRET"
      },
      confirmation: {
        doc: "Confirmation",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_CONFIRMATION"
      },
      utils_short_link_url: {
        doc: "Payment url",
        format: "url",
        default: "",
        env: "CREDENTIALS_VK_UTILS_SHORT_LINK_URL"
      }
    },
    qiwi: {
      account_number: {
        doc: "Account (phone number 7XXXXXXXXXX)",
        format: function check(val) {
          if (!/^7\d{10}$/.test(val)) {
            throw new Error("Номер телефона должен быть в формате 7XXXXXXXXXX");
          }
        },
        default: "",
        env: "CREDENTIALS_QIWI_ACCOUNT_NUMBER"
      },
      access_token: {
        doc: "Access token for Qiwi payment API",
        format: String,
        default: "",
        env: "CREDENTIALS_QIWI_ACCESS_TOKEN"
      },
      payment_url: {
        doc: "Payment url",
        format: "url",
        default: "",
        env: "CREDENTIALS_QIWI_PAYMENT_URL"
      },
      withdraw_url: {
        doc: "Withdraw url",
        format: "url",
        default: "",
        env: "CREDENTIALS_QIWI_WITHDRAW_URL"
      }
    },
    vk_coin: {
      account_number: {
        doc: "Account (vk id)",
        format: function check(val) {
          if (!/^\d+$/.test(val)) {
            throw new Error("некорректный Vkontakte id");
          }
        },
        default: "",
        env: "CREDENTIALS_VK_COIN_ACCOUNT_NUMBER"
      },
      access_token: {
        doc: "Access token for vk coin payment API",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_COIN_ACCESS_TOKEN"
      },
      payment_url: {
        doc: "Payment url",
        format: "url",
        default: "",
        env: "CREDENTIALS_VK_COIN_PAYMENT_URL"
      },
      withdraw_url: {
        doc: "Withdraw url",
        format: "url",
        default: "",
        env: "CREDENTIALS_VK_COIN_WITHDRAW_URL"
      }
    }
  },
  debug: {
    log_level: {
      doc: "Log level",
      format: function check(val) {
        regexp = /debug|info|warn|error|fatal/i;
        if (!regexp.test(val)) {
          throw new Error(`Unpermitted log level: ${val}`);
        }
      },
      default: "info",
      env: "DEBUG_LOG_LEVEL"
    },
    url: {
      doc: "Debug url",
      format: "url",
      default: "http://localhost:9001",
      env: "DEBUG_URL"
    }
  }
});

// Load environment dependent configuration
let env = config.get("env");
config.loadFile("./config/" + env + ".json");

// Perform validation
config.validate({ allowed: "strict" });

// custom functions
config.isProductionEnv = function() {
  return this.get("env") === "production";
};

config.isDevelopmentEnv = function() {
  return this.get("env") === "development";
};

module.exports = config;
