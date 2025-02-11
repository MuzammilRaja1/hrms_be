// 'use strict';
// const { Model, DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   class Employee extends Model {
//     static associate(models) {
//       Employee.belongsTo(models.Designation, {
//         foreignKey: 'designationId',
//         as: 'designationDetails',
//       });

//       Employee.belongsToMany(models.Project, {
//         through: 'EmployeeProjects',
//         foreignKey: 'employeeId',
//         as: 'projects',
//       });

//       Employee.hasMany(models.Leave, {
//         foreignKey: 'employeeId',
//         as: 'leaves',
//       });
//     }
//   }

//   Employee.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false,
//         validate: {
//           isEmail: true,
//         },
//       },
//       phoneNumber: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       role: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       designationId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: 'Designations',
//           key: 'id',
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'SET NULL',
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       isDeleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//       isActivated: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//     },
//     {
//       sequelize,
//       modelName: 'Employee',
//       tableName: 'Employees',
//       timestamps: true,
//     }
//   );

//   return Employee;
// };


'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Designation, {
        foreignKey: 'designationId',
        as: 'designationDetails',
      });

      Employee.belongsToMany(models.Project, {
        through: 'EmployeeProjects',
        foreignKey: 'employeeId',
        as: 'projects',
      });

      Employee.hasMany(models.Leave, {
        foreignKey: 'employeeId',
        as: 'leaves',
      });
    }
  }

  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Designations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActivated: {
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
      modelName: 'Employee',
      tableName: 'Employees',
      timestamps: true,
    }
  );

  return Employee;
};
