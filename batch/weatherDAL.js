const { HourlyWeather, DailyWeather } = require('../models');

async function upsertHourlyWeathers(hourlyWeathers) {
    await HourlyWeather.bulkCreate(hourlyWeathers, {
        updateOnDuplicate: ['temperature', 'pop', 'climate_id']
    });
}

async function upsertDailyWeathers(dailyWeathers) {
    await DailyWeather.bulkCreate(dailyWeathers, {
        updateOnDuplicate: [
            'temperature_max',
            'temperature_min',
            'humidity',
            'climate_id',
            'precipitation',
            'wind_speed',
            'wind_direction'
        ]
    });
}

module.exports = {
    saveHourlyWeathers: upsertHourlyWeathers,
    saveDailyWeathers: upsertDailyWeathers
};
