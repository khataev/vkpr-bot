const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../menu-option");

class InfoOption extends MenuOption {
  get chatMessage() {
    // TODO:
    return `
    📊 Действительный курс на 26.11.2019:
    💲 Продажа VKCoin: 1.000.000 - 0.95р.
    💱 Скупка VKCoin: 1.000.000 - 0.83р.

    👥 Всего пользователей: 19032
    💶 Всего платежей: 2825

    📥 Всего вложено VK Coin: 185116844650.23
    📥 Всего вложено RUB: 76883.48

    💱 Обменено VK Coin на RUB: 124380508771.94
    💱 Обменено RUB на VK Coin: 79401.32

    📤 Всего выведено VK Coin: 159775000967.93
    📤 Всего выведено RUB: 79140.85
    `;
  }

  get buttonMarkup() {
    return Markup.button("📊 Курс / Информация", "secondary", {
      button: this.triggerButton
    });
  }

  get triggerButton() {
    return "info_button";
  }
}

module.exports = InfoOption;
