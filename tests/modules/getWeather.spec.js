const assert = require('assert');
const climateIds = require('../../config/climateIds.json');
const getWeather = require('../../batch/getWeather');

describe('Get Weather test', function () {
    describe('Get Weather, Success case test', () => {
        let locationCode, lat, lon;
        let dateTime;
        let climateIdArray;

        before('set parameter (code, lat, lng)', () => {
            dateTime = new Date();
            climateIdArray = Object.keys(climateIds).map((data) =>
                parseInt(data)
            );
            const nightClimateIdArray = climateIdArray.map(
                (data) => parseInt(data) + 100
            );

            climateIdArray = new Set([
                ...climateIdArray,
                ...nightClimateIdArray
            ]);
            locationCode = 1100000000;
            lat = 37.56356944;
            lon = 126.98000833333333;
        });
        after('reset variable', () => {
            locationCode = undefined;
            lat = undefined;
            lon = undefined;
            climateIdArray = undefined;
        });

        it('Get weather', async () => {
            const { hourlyList, dailyList } = await getWeather(
                lat,
                lon,
                locationCode
            );

            assert.ok(hourlyList.length === 48);
            assert.ok(dailyList.length === 8);

            for (let hourly of hourlyList) {
                const date = [
                    dateTime.getFullYear(),
                    dateTime.getMonth() + 1,
                    dateTime.getDate()
                ].join('-');

                assert.ok(hourly.date === date);
                assert.ok(hourly.hour === dateTime.getHours());
                assert.ok(-50 <= hourly.temperature <= 50);
                assert.ok(0 <= hourly.pop <= 100);
                assert.ok(climateIdArray.has(hourly.climate_id));

                dateTime.setHours(dateTime.getHours() + 1);
            }
        });
    });
});
