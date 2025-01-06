const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Employee = require('./employee')(sequelize, DataTypes);
const Leave = require('./leave')(sequelize, DataTypes);

sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database', err));


module.exports = { sequelize, Employee, Leave };
