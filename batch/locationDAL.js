const { Location } = require('../models');

async function selectLocationsAll() {
    const locations = await Location.findAll({
        attributes: ['id', 'lat', 'lng']
    });

    return locations;
}

async function a() {
    const locations = await Location.findOne({
        where: {
            id: 1
        }
    });
    if (locations === null) {
        console.log(locations);
    }
    console.log(locations);
    return locations;
}
a();
module.exports = {
    getLocationsAll: selectLocationsAll
};
