'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    static associate(models) {
      Designation.hasMany(models.Employee, {
        foreignKey: 'designation',
        as: 'employees',
      });

    }
  }

  Designation.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Designation',
    tableName: 'Designations',
  });

  return Designation;
};
