'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    static associate(models) {
    }
  }

  Leave.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id',
        },
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      toDate: {
        type: DataTypes.DATE,
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
      leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['half-day', 'full-day', 'weekend', 'monthly']],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'approved', 'disapproved']],
        },
      },
      reason: {
        type: DataTypes.STRING,
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
    }
  );

  return Leave;
};
