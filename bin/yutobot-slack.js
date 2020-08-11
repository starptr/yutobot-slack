require("dotenv").config();

const fs = require("fs").promises;

const axios = require("axios").default;

const {
  App
} = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

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

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3002);
  fancyLog("⚡️ Bolt app is running!"); //Unicode counter

  let unicode_index = parseInt((await fs.readFile("unicount.txt")).toString()); // Count up the unicode chars

  const printNextUnicode = async () => {
    const currentChar = String.fromCharCode(unicode_index);

    try {
      await app.client.chat.postMessage({
        token: process.env.SLACK_OAUTH_TOKEN,
        channel: process.env.SLACK_COUNTING_UNICODE_CHANNEL,
        text: ` ${currentChar} `
      });
      unicode_index++;
      if (unicode_index % 10 === 0) await fs.writeFile("unicount.txt", unicode_index.toString());
    } catch (err) {
      if (err.data.error === "no_text") {
        try {
          await app.client.chat.postMessage({
            token: process.env.SLACK_OAUTH_TOKEN,
            channel: process.env.SLACK_COUNTING_UNICODE_CHANNEL,
            text: `[Invalid unicode character for a Slack message. Char code: ${unicode_index}]`
          });
          unicode_index++;
          if (unicode_index % 10 === 0) await fs.writeFile("unicount.txt", unicode_index.toString());
        } catch (err) {
          fancyLog(err);
        }
      } else {
        fancyLog(err);
      }
    }

    setTimeout(printNextUnicode, 1000);
  };

  printNextUnicode();
})();
