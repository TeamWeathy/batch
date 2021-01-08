const { saveHourlyWeathers, saveDailyWeathers } = require('./weatherDAL');
module.exports = async function renewWeather(hourlyList, dailyList) {
    saveHourlyWeathers(hourlyList);
    saveDailyWeathers(dailyList);
};
