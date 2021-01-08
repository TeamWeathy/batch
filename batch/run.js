const scheduler = require('node-schedule');
const slack = require('../modules/slack');
const logger = require('../modules/logger');
const task = require('./task');

async function runTask(rulesHour, rulesMinute = 0) {
    const rules = new scheduler.RecurrenceRule();

    rules.hour = rulesHour;
    rules.minute = rulesMinute;

    try {
        scheduler.scheduleJob(rules, async function () {
            try {
                await task();
            } catch (err) {
                logger.error(err.stack);
                slack.send(
                    'Batch Error : 갱신 실패, Batch Error log 확인 요망'
                );
            }
        });
    } catch (err) {
        logger.error(err.stack);
        slack.send('Batch Error : 갱신 실패, Batch Error log 확인 요망');
    }
}

runTask(0, 7);
