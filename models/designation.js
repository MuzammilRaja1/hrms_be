'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Designation extends Model {
    static associate(models) {
      Designation.hasMany(models.Employee, {
        foreignKey: 'designationId',
        as: 'employees',
      });
    }
  }

  Designation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Designation',
      tableName: 'Designations',
      timestamps: true,
    }
  );

  return Designation;
};
