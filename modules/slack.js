const Slack = require('slack-node'); // 슬랙 모듈 사용
const logger = require('./logger');

const config = require('../config/slack');

const slack = new Slack();
slack.setWebhook(config.webhookUri);

const send = async (message) => {
    slack.webhook(
        {
            text: message
        },
        function (err, response) {
            if (err) {
                logger.error(`Cannot send message to slack, ${err}`);
            }

            logger.info(`Send message to slack, ${response}`);
        }
    );
};

module.exports = { send };
