const express = require('express');
const { getAllEmployee, createEmployee, adminLogin, loginEmployee, updateEmployeeDetail, getEmployeeProjects } = require('../controllers/employeeController');
const asyncHandler = require('../middlewares/catchAsyncError');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const employeeValidator = require('../middlewares/employeeValidator');

const router = express.Router();


router.post('/login', asyncHandler(loginEmployee));
router.post('/admin-login', asyncHandler(adminLogin));
router.post(
  '/create-employee',
  employeeValidator,
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(createEmployee)
);
router.put(
  '/update-employee',
  authMiddleware,
  asyncHandler(updateEmployeeDetail)
);
router.get(
  '/get-employees',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(getAllEmployee)
);
router.get(
  '/projects',
  authMiddleware,
  asyncHandler(getEmployeeProjects)
);


module.exports = router;
