const request = require('request-promise');

const openweatherConfig = require('../config/openWeatherApi.json');
const weatherIds = require('../config/weather_id.json');

module.exports = async function getWeather(lat, lon, locationId) {
    //parameters: (위도, 경도, 행정코드)

    const options = {
        uri: openweatherConfig.uri,
        qs: {
            lat,
            lon,
            exclude: openweatherConfig.exclude,
            units: openweatherConfig.units,
            appid: openweatherConfig.key
        }
    };

    const data = await request(options);
    const obj = JSON.parse(data);
    const { hourly, daily } = obj;

    if (typeof hourly === 'undefined' || typeof daily === 'undefined') {
        throw Error('Cannot load hourly & daily data from Open Weather API');
    }

    const hourlyList = changeToHourlyDBSaveFormat(hourly, locationId);
    const dailyList = changeToDailyDBSaveFormat(daily, locationId);

    return {
        hourlyList,
        dailyList
    };
};

function changeToHourlyDBSaveFormat(weathers, locationId) {
    const hourlyData = [];

    for (let h of weathers) {
        const { dt, temp: temperature, weather, pop } = h;
        const { id, icon } = weather[0];

        const dateTime = new Date(dt * 1000);
        const hour = dateTime.getHours();
        const date = [
            dateTime.getFullYear(),
            dateTime.getMonth() + 1,
            dateTime.getDate()
        ].join('-');

        const climateId = changeToWeatherId(id, icon);

        if (
            typeof date !== 'string' ||
            typeof hour !== 'number' ||
            typeof temperature !== 'number' ||
            typeof pop !== 'number' ||
            typeof climateId !== 'number'
        ) {
            throw Error('Hourly Open weather api variable was changed!');
        }

        hourlyData.push({
            date,
            hour,
            temperature,
            pop: 100 * pop,
            climate_id: climateId,
            location_id: locationId
        });
    }
    return hourlyData;
}

function changeToDailyDBSaveFormat(weathers, locationId) {
    const dailyData = [];

    for (let d of weathers) {
        const {
            dt,
            temp: temperature,
            humidity,
            wind_deg: windDirection,
            wind_speed: windSpeed,
            rain,
            snow,
            weather
        } = d;
        const { min: minTemp, max: maxTemp } = temperature;
        const { id, icon } = weather[0];

        if (
            typeof dt !== 'number' ||
            typeof minTemp !== 'number' ||
            typeof maxTemp !== 'number' ||
            typeof humidity !== 'number' ||
            typeof windDirection !== 'number' ||
            typeof windSpeed !== 'number' ||
            typeof id !== 'number' ||
            typeof icon !== 'string'
        ) {
            throw Error('Daily Open weather api variable was changed!');
        }
        const precipitation = Math.round(rain || snow || 0);
        const climateId = changeToWeatherId(id, icon);

        const time = new Date(dt * 1000);
        const date = [
            time.getFullYear(),
            time.getMonth() + 1,
            time.getDate()
        ].join('-');

        dailyData.push({
            date,
            temperature_min: minTemp,
            temperature_max: maxTemp,
            humidity,
            wind_direction: windDirection,
            wind_speed: windSpeed.toFixed(1),
            climate_id: climateId,
            precipitation,
            location_id: locationId
        });
    }

    return dailyData;
}

function changeToWeatherId(weatherId, iconId) {
    const weathyIds = Object.keys(weatherIds);
    const dayNight = iconId.slice(-1);

    for (let id of weathyIds) {
        const idSet = new Set(weatherIds[id].ids);

        if (idSet.has(weatherId)) {
            if (dayNight === 'd') {
                return parseInt(id);
            } else {
                return parseInt(id) + 100;
            }
        }
    }
    return -1;
}
