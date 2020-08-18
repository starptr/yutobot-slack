let app;

const fancyLogConfig = appInstance => {
  app = appInstance;
};

const fancyLog = (msg, channel = process.env.SLACK_LOG_CHANNEL) => {
  if (msg.message) console.error(msg);else console.log(msg);
  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    //ID or name
    channel,
    text: null,
    attachments: [{
      color: msg.message ? "#ff0000" : "#dddddd",
      blocks: [{
        type: "section",
        text: {
          type: "plain_text",
          text: `${msg.message || msg}`,
          emoji: false
        }
      }]
    }]
  });
};

module.exports = {
  fancyLog,
  fancyLogConfig
};