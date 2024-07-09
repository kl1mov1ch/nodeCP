const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'NodeCP', // имя базы данных
    'postgres', // имя пользователя
    'Kanton731', // пароль пользователя
    {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
    }
);

module.exports = sequelize;
