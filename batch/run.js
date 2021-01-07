const scheduler = require('node-schedule');
const renewWeathers = require('./renewWeather');
const slack = require('../modules/slack');
const logger = require('../modules/logger');
const RULES_HOUR = 19;

async function runTask() {
    const rules = new scheduler.RecurrenceRule();

    rules.hour = RULES_HOUR;
    try {
        scheduler.scheduleJob(rules, async function () {
            try {
                logger.info(`Update Weathers: timestamp :${Date.now()}`);
                await renewWeathers();
                logger.info(`Done: Current timestamp :${Date.now()}`);
            } catch (err) {
                logger.error(err.stack);
                slack.send(
                    'Batch Error : 갱신 실패, Batch Error log 확인 요망 (일어나... 일해야지..)'
                );
            }
        });
    } catch (err) {
        logger.error(err.stack);
        slack.send(
            'Batch Error : 갱신 실패, Batch Error log 확인 요망 (일어나... 일해야지..)'
        );
    }
}

runTask();
