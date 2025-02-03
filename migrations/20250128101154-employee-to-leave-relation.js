'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Leaves', {
      fields: ['employeeId'],
      type: 'foreign key',
      name: 'fk_employeeId_leaves',
      references: {
        table: 'Employees',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Leaves', 'fk_employeeId_leaves');
  },
};
