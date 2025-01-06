const { body } = require('express-validator');

const createEmployeeValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('role')
    .isIn(['Admin', 'HR', 'Manager', 'Employee'])
    .withMessage('Invalid role provided'),
  body('department')
    .notEmpty()
    .withMessage('Department is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const updateEmployeeValidator = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('role')
    .optional()
    .isIn(['Admin', 'HR', 'Manager', 'Employee'])
    .withMessage('Invalid role provided'),
  body('department')
    .optional()
    .notEmpty()
    .withMessage('Department cannot be empty'),
];

module.exports = {
  createEmployeeValidator,
  updateEmployeeValidator,
};
