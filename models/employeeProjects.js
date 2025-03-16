const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  const EmployeeProject = sequelize.define(
    "EmployeeProject",
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Employees", key: "id" },
        onDelete: "CASCADE",
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Projects", key: "id" },
        onDelete: "CASCADE",
      },
      assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: true }
  );

  EmployeeProject.associate = (models) => {
    EmployeeProject.belongsTo(models.Employee, { foreignKey: "employeeId" });
    EmployeeProject.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return EmployeeProject;
};
