const express = require('express');
const { getAllEmployee, createEmployee, adminLogin, loginEmployee } = require('../controllers/employeeController');
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
  roleMiddleware('ADMIN'),
  asyncHandler(createEmployee)
);
router.get(
  '/get-employees',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(getAllEmployee)
);


module.exports = router;
