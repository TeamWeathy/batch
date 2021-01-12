const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.json')[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.HourlyWeather = require('./hourlyWeather')(sequelize, Sequelize);
db.DailyWeather = require('./dailyWeather')(sequelize, Sequelize);
db.Location = require('./location')(sequelize, Sequelize);
db.Climate = require('./climate')(sequelize, Sequelize);

db.Location.hasMany(
    db.HourlyWeather,
    { foreignKey: 'location_id' },
    { onDelete: 'RESTRICT' }
);
db.HourlyWeather.belongsTo(db.Location, {
    foreignKey: 'location_id'
});

db.Location.hasMany(
    db.HourlyWeather,
    { foreignKey: 'location_id' },
    { onDelete: 'RESTRICT' }
);
db.DailyWeather.belongsTo(db.Location, {
    foreignKey: 'location_id'
});

db.Climate.hasMany(
    db.DailyWeather,
    { foreignKey: 'climate_id' },
    { onDelete: 'RESTRICT' }
);
db.DailyWeather.belongsTo(db.Climate, {
    foreignKey: 'climate_id'
});

db.Climate.hasMany(
    db.HourlyWeather,
    { foreignKey: 'climate_id' },
    { onDelete: 'RESTRICT' }
);
db.HourlyWeather.belongsTo(db.Climate, {
    foreignKey: 'climate_id',
    targetKey: 'icon_id'
});

module.exports = db;
