'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Project.belongsToMany(models.Employee, {
      //   through: 'EmployeeProjects',
      //   foreignKey: 'projectId',
      //   otherKey: 'employeeId',
      //   as: 'employees',
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // });
      Project.belongsToMany(models.Employee, {
        through: 'EmployeeProjects',
        foreignKey: 'projectId',
        otherKey: 'employeeId',
        as: 'employees',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'Projects',
      timestamps: true,
    }
  );

  return Project;
};
