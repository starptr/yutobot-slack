# yutobot-slack
My online presence automator.

## Deploy
1. Create a file named `unicount.txt` at the project root. Write `0` inside, no newline.
2. Create a file named `.env` at the project root. Define these value:
```
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
SLACK_OAUTH_TOKEN=
SLACK_LOG_CHANNEL=
SLACK_COUNTING_UNICODE_CHANNEL=
```
3. Run these:
```sh
$ yarn install
$ yarn build
$ yarn deploy
```
