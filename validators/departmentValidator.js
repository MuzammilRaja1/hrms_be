const { body } = require('express-validator');

const createDepartmentValidator = [
  body('departmentName')
    .notEmpty()
    .withMessage('Department name is required'),
];

module.exports = {
  createDepartmentValidator,
};
