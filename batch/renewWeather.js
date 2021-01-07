const { saveHourlyWeathers, saveDailyWeathers } = require('./weatherDAL');
const { getLocationsAll } = require('./locationDAL');
const getWeather = require('./getWeather');

module.exports = async function renewWeather() {
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

        saveHourlyWeathers(hourlyList);
        saveDailyWeathers(dailyList);
    }
};
