require("dotenv").config();
const fs = require("fs").promises;
const axios = require("axios").default;
const { App } = require("@slack/bolt");

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const unicodeCounterStart = require("./modules/unicode-counter");

const fancyLog = (msg, channel = process.env.SLACK_LOG_CHANNEL) => {
	if (msg.message) console.error(msg);
	else console.log(msg);

	app.client.chat.postMessage({
		token: process.env.SLACK_BOT_TOKEN,
		//ID or name
		channel,
		text: null,
		attachments: [
			{
				color: msg.message ? "#ff0000" : "#dddddd",
				blocks: [
					{
						type: "section",
						text: {
							type: "plain_text",
							text: `${msg.message || msg}`,
							emoji: false,
						},
					},
				],
			},
		],
	});
};

// Listens to incoming messages that contain "hello"
app.message("!ping", async ({ message, say }) => {
	// say() sends a message to the channel where the event was triggered
	await say(`Pong!`);
});

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3002);

	fancyLog("⚡️ Bolt app is running!");

	await unicodeCounterStart(app);
})();
