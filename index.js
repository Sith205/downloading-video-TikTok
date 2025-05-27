const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7974736764:AAFGLTOtEj2LWHCoCiyaiICjn_4Rqof9iTE';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'សូមផ្ញើតំណវីដេអូ TikTok ដើម្បីទាញយកវីដេអូ');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.includes('tiktok.com')) {
    // បង្ហាញសារសម្រាប់រង់ចាំ
    const waitMessage = await bot.sendMessage(chatId, '⏳ Please wait... កំពុងទាញយកចំណងជើង និងវីដេអូ');

    try {
      // ទាញយកព័ត៌មានវីដេអូពី API (TikWM ឧទាហរណ៍)
      const response = await axios.get(`https://api.tikwm.com/api/v1/video/info?url=${encodeURIComponent(text)}`);

      // បញ្ចូលចំណងជើង និង url វីដេអូ
      const videoTitle = response.data.title || 'TikTok Video';
      const videoUrl = response.data.video.play;

      // លុបសាររង់ចាំ
      await bot.deleteMessage(chatId, waitMessage.message_id);

      // ផ្ញើចំណងជើងជាអត្ថបទ
      await bot.sendMessage(chatId, `🎬 ចំណងជើងវីដេអូ៖ ${videoTitle}`);

      // ផ្ញើវីដេអូទៅអ្នកប្រើប្រាស់
      await bot.sendVideo(chatId, videoUrl);

    } catch (error) {
      // លុបសាររង់ចាំ
      await bot.deleteMessage(chatId, waitMessage.message_id);

      // បង្ហាញសារបង្ហាញកំហុស
      bot.sendMessage(chatId, '❌ មានបញ្ហាក្នុងការទាញយកវីដេអូ TikTok សូមព្យាយាមម្តងទៀត');
      console.error(error);
    }
  }
});
