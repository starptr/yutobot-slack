const _ = require("lodash");
const axios = require("axios").default;
const { fancyLog } = require("../../fancyLog");

const getLocalDateNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));

const wiggler = async app => {
	// Get all urls
	let pfpsUrlsAll = require("./pfpsUrls.json");

	// Last presence
	let wasActive = true;
	// Last minute of execution
	let m = getLocalDateNow().getMinutes() - 1;
	// Last pfp's index
	let oldIndex = -1;

	// Push pfp
	const pushPfpFromUrl = async pfpUrl => {
		try {
			// Push pfp
			const res = await axios.get(pfpUrl, { responseType: "arraybuffer" });
			const result = await app.client.users.setPhoto({
				token: process.env.SLACK_OAUTH_TOKEN,
				image: Buffer.from(res.data),
			});
		} catch (err) {
			fancyLog(err);
		}
	};

	// Repeated func
	const randomPushPfp = async isDay => {
		let dayStr = isDay ? "day" : "night";

		// Choose an index not equal to the last index (this algo makes it impossible to choose last pfp on first iteration)
		// i iterates through pfpsUrls's indicies
		let i = oldIndex + 1;
		if (i >= pfpsUrlsAll[dayStr].length) {
			i = 0;
			// Shuffle pfpsUrls after going through all
			pfpsUrlsAll[dayStr] = _.shuffle(pfpsUrlsAll[dayStr]);
		}
		oldIndex = i;

		await pushPfpFromUrl(pfpsUrlsAll[dayStr][i]);
	};

	// Call every 10 seconds, but updates only every minute
	const updateJob = setInterval(async () => {
		let now = getLocalDateNow();
		// Is active?
		if (
			(
				await app.client.users.getPresence({
					token: process.env.SLACK_OAUTH_TOKEN,
					user: process.env.SLACK_AUTHED_USERID,
				})
			).presence === "active"
		) {
			// Run only every minute, or if presence changed
			if (now.getMinutes() !== m || !wasActive) {
				// Rare pfps
				if ((now.getHours() === 11 || now.getHours() === 23) && now.getMinutes() === 11) {
					await pushPfpFromUrl(pfpsUrlsAll["special"]["1111"]);
				} else if ((now.getHours() === 4 || now.getHours() === 16) && now.getMinutes() === 20) {
					await pushPfpFromUrl(pfpsUrlsAll["special"]["420"]);
				} else {
					// Day mode between 6 and 18 o'clock, otherwise night
					await randomPushPfp(!!(now.getHours() >= 6 && now.getHours() < 18));
				}
			}
			wasActive = true;
		} else {
			// Run only every minute, or if presence changed
			if (now.getMinutes() !== m || wasActive) {
				// Vary offline pfp by time
				if (now.getHours() >= 6 && now.getHours() < 18) {
					await pushPfpFromUrl(pfpsUrlsAll["special"]["yawn"]);
				} else {
					await pushPfpFromUrl(pfpsUrlsAll["special"]["sleep"]);
				}
			}
			wasActive = false;
		}

		m = now.getMinutes();
	}, 1000 * 10);
};

module.exports = wiggler;
