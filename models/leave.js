module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define(
    'Leave',
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
            if (this.from_date >= this.to_date) {
              throw new Error("'from_date' must be earlier than 'to_date'.");
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
        type: DataTypes.ENUM('half-day', 'full-day', 'weekend', 'monthly'),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'disapproved'),
        defaultValue: 'pending',
        allowNull: false,
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
      paranoid: true,
    }
  );

  Leave.associate = function (models) {
    Leave.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });
  };

  return Leave;
};
