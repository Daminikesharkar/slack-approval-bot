const { WebClient } = require('@slack/web-api');
require('dotenv').config();

//Initialize the Slack-WebClient with the slack-bot token from environment variables
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

module.exports = slackClient;