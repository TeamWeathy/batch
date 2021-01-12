const assert = require('assert');
const renewWeather = require('../../batch/renewWeather');
const { HourlyWeather, DailyWeather } = require('../../models');

describe('renew Weather test', function () {
    describe('renew Weather', () => {
        let hourlyList, dailyList;
        let hourlyData, dailyData;

        before('set parameter (hourly, daily)', () => {
            hourlyData = {
                date: '3000-01-01',
                hour: 12,
                temperature: 10,
                pop: 0,
                climate_id: 2,
                location_id: 1100000000
            };

            dailyData = {
                date: '3000-01-01',
                temperature_min: -1,
                temperature_max: 1,
                humidity: 12,
                wind_direction: 240,
                wind_speed: 0.1,
                climate_id: 2,
                precipitation: 0,
                location_id: 1100000000
            };

            hourlyList = [hourlyData];
            dailyList = [dailyData];
        });

        after('reset variable', async () => {
            hourlyData = undefined;
            dailyData = undefined;
            hourlyList = undefined;
            dailyList = undefined;

            await HourlyWeather.destroy({
                where: {
                    date: '3000-01-01'
                },
                force: true
            });
            await DailyWeather.destroy({
                where: {
                    date: '3000-01-01'
                },
                force: true
            });
        });

        it('Insert weather test', async () => {
            let hw = await HourlyWeather.findOne({
                where: {
                    date: '3000-01-01'
                }
            });

            let dw = await DailyWeather.findOne({
                where: {
                    date: '3000-01-01'
                }
            });

            assert.ok(hw === null);
            assert.ok(dw === null);

            await renewWeather(hourlyList, dailyList);

            hw = await HourlyWeather.findOne({
                where: {
                    date: '3000-01-01'
                },
                attributes: [
                    'date',
                    'hour',
                    'temperature',
                    'pop',
                    'climate_id',
                    'location_id'
                ]
            });

            dw = await DailyWeather.findOne({
                where: {
                    date: '3000-01-01'
                },
                attributes: [
                    'date',
                    'temperature_min',
                    'temperature_max',
                    'humidity',
                    'wind_direction',
                    'wind_speed',
                    'climate_id',
                    'precipitation',
                    'location_id'
                ]
            });

            const newHourlyData = hw.dataValues;
            for (let k of Object.keys(hw.dataValues)) {
                assert.ok(newHourlyData[k] === hourlyData[k]);
            }

            const newDailyData = dw.dataValues;
            for (let k of Object.keys(dw.dataValues)) {
                assert.ok(newDailyData[k] === dailyData[k]);
            }
        });
    });
});
