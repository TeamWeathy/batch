const weatherIds = require('../config/weather_id.json');

function changeToWeathyId(weatherId, iconId) {
    const weathyIds = Object.keys(weatherIds);
    const dayNight = iconId.slice(-1);

    for (let id of weathyIds) {
        const idSet = new Set(weatherIds[id].ids);

        if (idSet.has(weatherId)) {
            console.log(id);
            if (dayNight === 'd') {
                return parseInt(id);
            } else {
                return parseInt(id) + 100;
            }
        }
    }

    return -1;
}

console.log(changeToWeathyId(701, '11n'));

if (200 in [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]) {
    console.log('h');
}
