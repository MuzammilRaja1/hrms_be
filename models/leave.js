'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    static associate(models) {
      Leave.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employeeDetails',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Leave.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Employee',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          validDateRange() {
            if (this.fromDate >= this.toDate) {
              throw new Error("'fromDate' must be earlier than 'toDate'.");
            }
          },
        },
      },
      leaveTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
      leaveType: {
        type: DataTypes.ENUM('half-day', 'full-day', 'weekend', 'monthly'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'disapproved'),
        allowNull: false,
        defaultValue: 'pending',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Leave',
      timestamps: true,
    }
  );

  return Leave;
};
