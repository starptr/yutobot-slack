const fs = require("fs").promises;

const unicode_counter = async app => {
	//Unicode counter
	let unicode_index;
	try {
		let rawBuffer = await fs.readFile("unicount.txt");
		unicode_index = parseInt(rawBuffer.toString());
	} catch (err) {
		throw err;
	}

	// Count up the unicode chars
	const printNextUnicode = async () => {
		const currentChar = String.fromCharCode(unicode_index);
		try {
			await app.client.chat.postMessage({
				token: process.env.SLACK_OAUTH_TOKEN,
				channel: process.env.SLACK_COUNTING_UNICODE_CHANNEL,
				text: ` ${currentChar} `,
			});
			unicode_index++;
			if (unicode_index % 10 === 0) await fs.writeFile("./unicount.txt", unicode_index.toString());
		} catch (err) {
			if (err.data.error === "no_text") {
				try {
					await app.client.chat.postMessage({
						token: process.env.SLACK_OAUTH_TOKEN,
						channel: process.env.SLACK_COUNTING_UNICODE_CHANNEL,
						text: `[Invalid unicode character for a Slack message. Char code: ${unicode_index}]`,
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
		// Guarantees at least 1 second delay
		setTimeout(printNextUnicode, 1000);
	};
	printNextUnicode();
};

module.exports = unicode_counter;
