/**
 * Mengirim pesan ke Telegram bot dengan response structured
 * @param {object} bot - instance TelegramBot
 * @param {number|string} chatId - ID chat/group
 * @param {string} message - isi pesan
 * @param {object} options - opsi tambahan (misal parse_mode)
 * @returns {Promise<object>} response structured
 */
function escapeMarkdown(text) {
  // Cek apakah ada sintaks formatting
  // const hasFormatting = /(\*.*\*|_.*_|`.*`)/.test(text);
  
  // if (hasFormatting) {
  //   // Jangan escape, biarkan user sengaja pakai format
  //   return text;
  // }

  // Kalau gak ada formatting, baru escape semua supaya aman
  // return text.replace(/[_*[\]()~`>#+\-=|{}]/g, ' '); 
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

async function sendTelegramMessage(bot, chatId, message, options = {}) {
  let newMessage = message;

  if (options.parse_mode === 'MarkdownV2') {
    newMessage = escapeMarkdown(message);
  }
  try {
    const response = await bot.sendMessage(chatId, newMessage, options);

    return {
      success: true,
      message_id: response.message_id,
      chat: {
        id: response.chat.id,
        title: response.chat.title,
        type: response.chat.type
      },
      from: {
        id: response.from.id,
        username: response.from.username,
        is_bot: response.from.is_bot
      },
      text: response.text,
      date: new Date(response.date * 1000) // convert UNIX timestamp
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || err.toString()
    };
  }
}

export default sendTelegramMessage;
