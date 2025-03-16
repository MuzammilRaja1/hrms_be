const express = require('express');
const { getAllEmployee, createEmployee, adminLogin, loginEmployee, updateEmployeeDetail, getEmployeeProjects, updateEmployeeDetailAdmin, getEmployeeData, getEmployeeStatistics } = require('../controllers/employeeController');
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
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(updateEmployeeDetailAdmin)
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
  '/me',
  authMiddleware,
  asyncHandler(getEmployeeData)
);
router.get(
  '/statistics',
  authMiddleware,
  asyncHandler(getEmployeeStatistics)
);
router.get(
  '/projects',
  authMiddleware,
  asyncHandler(getEmployeeProjects)
);


module.exports = router;
