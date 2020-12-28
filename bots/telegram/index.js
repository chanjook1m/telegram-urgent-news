const { Telegraf } = require("telegraf");
const { token } = require("../../config/telegram.json");
const Request = require("../crawler/index.js");

const bot = new Telegraf(token);
const req = new Request();

let interval = null;
let previousNews = null;

//bot.webhookReply = true;
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});

bot.command("news", (ctx) => {
  if (!interval) {
    interval = setInterval(async () => {
      let currentNews = await req.getNews();
      if (currentNews != previousNews) {
        ctx.reply(await req.getNews());
      }
      previousNews = currentNews;
    }, 30000);
  }
});

bot.command("stop", (ctx) => {
  if (interval) {
    clearInterval(interval);
  }
});

module.exports = bot;
