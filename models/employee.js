'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Designation, {
        foreignKey: 'designation',
        as: 'designationDetails',
      });
      Employee.belongsToMany(models.Project, {
        through: 'EmployeeProjects',
        foreignKey: 'employeeId',
        as: 'projects',
      });
    }
  }
  Employee.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: DataTypes.STRING,
      role: DataTypes.STRING,
      designation: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Designations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      password: DataTypes.STRING,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Employee',
      tableName: 'Employees',
    }
  );
  return Employee;
};
