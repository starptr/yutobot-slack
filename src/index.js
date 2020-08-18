require("dotenv").config();
const fs = require("fs").promises;
const axios = require("axios").default;
const { fancyLog, fancyLogConfig } = require("./fancyLog");
const { App } = require("@slack/bolt");

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

fancyLogConfig(app);

const unicodeCounterStart = require("./modules/unicode-counter");
const wiggler = require("./modules/wiggler");

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

	await wiggler(app);
})();
