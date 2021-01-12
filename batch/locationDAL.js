const { Location } = require('../models');

async function selectLocationsAll() {
    const locations = await Location.findAll({
        attributes: ['id', 'lat', 'lng']
    });

    return locations;
}

module.exports = {
    getLocationsAll: selectLocationsAll
};
