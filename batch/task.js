const { getLocationsAll } = require('./locationDAL');
const getWeather = require('./getWeather');
const renewWeather = require('./renewWeather');
const logger = require('../modules/logger');

module.exports = async function task() {
    logger.info(`Update Weathers: timestamp :${Date.now()}`);

    const locations = await getLocationsAll();

    if (!locations.length) {
        throw Error('Empty locations!');
    }

    for (let location of locations) {
        const { id: locationId, lat, lng } = location.dataValues;

        const { hourlyList, dailyList } = await getWeather(
            lat,
            lng,
            locationId
        );
        await renewWeather(hourlyList, dailyList);
    }

    logger.info(`Done: Current timestamp :${Date.now()}`);
};
