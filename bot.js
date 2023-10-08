const config = require('./config.js');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token, { polling: true });
const fs = require('fs-extra');

async function downloadStickers(stickerSetName, downloadPath) {
    const stickerSet = await bot.getStickerSet(stickerSetName);
    if (stickerSet) {
        const stickers = stickerSet.stickers;
        // 创建下载目录
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }
        stickers.forEach(async (sticker, index) => {
            const stickerFile = await bot.getFile(sticker.file_id);
            // 下载sticker文件
            if (!fs.existsSync(downloadPath + stickerFile)) {
                await bot.downloadFile(stickerFile.file_id, downloadPath);
            }
        });
        return true;
    } else {
        return false;
    }
}

function stickersHandler(msg, match) {
    const chatId = msg.chat.id;
    var stickerSetName = match[1];
    var stickersPath = "./storage/" + stickerSetName + "/";
    if (downloadStickers(stickerSetName, stickersPath)) {
        bot.sendMessage(chatId, "获取成功，请前往storage查看");
    } else {
        bot.sendMessage(chatId, "获取失败！我摆烂了！");
    }
}

bot.onText(/https:\/\/t.me\/addstickers\/(.+)/, (msg, match) => {
    stickersHandler(msg, match);
});

bot.onText(/https:\/\/telegram.me\/addstickers\/(.+)/, (msg, match) => {
    stickersHandler(msg, match);
});