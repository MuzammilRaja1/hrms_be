module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 15],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [3, 15],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [3, 15],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM('HR', 'EMP', 'ADMIN', 'other'),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
  );

  Employee.associate = function (models) {
    Employee.hasMany(models.Leave, {
      foreignKey: 'employeeId',
      as: 'leaves',
    });
  };

  return Employee;
};
