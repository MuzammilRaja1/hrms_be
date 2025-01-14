const { Employee } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse } = require('../utils/responseHandler');
const jwtConfig = require('../config/jwtConfig');
const responseHandler = require('../utils/responseHandler');
const { Sequelize } = require('sequelize');


// only admin
exports.getAllEmployee = async (req, res) => {
  try {
    const users = await Employee.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// only admin
exports.createEmployee = async (req, res) => {
  const { username, email, role, password, confirmPassword, firstName, lastName } = req.body;
  const employee = await Employee.create({
    username,
    email,
    role,
    password,
    confirmPassword,
    firstName,
    lastName,
    isActivated: true,

  });
  successResponse(res, employee, 'Employee created successfully', 201);

};

exports.createDefaultAdmin = async () => {
  const existingAdmin = await Employee.findOne({ where: { email: 'admin@example.com' } });
  if (!existingAdmin) {
    await Employee.create({
      username: 'admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      password: 'admin123',
      firstName: "Muzz",
      lastName: "SuperSoft",
      isDeleted: false,
      isActivated: true,
    });

    console.log('Default admin created successfully!');
  } else {
    console.log('Admin already exists.');
  }
};

// only admin
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responseHandler.errorResponse(res, 'Email and password are required', 400);
  }

  const admin = await Employee.findOne({ where: { email, role: 'ADMIN' } });
  if (!admin) {
    return responseHandler.errorResponse(res, 'Invalid credentials', 401);
  }

  if (admin.isActivated === false) {
    return responseHandler.errorResponse(res, 'Your account is not activated', 403);
  }

  if (password !== admin.password) {
    return responseHandler.errorResponse(res, 'Invalid credentials', 401);
  }

  const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  responseHandler.successResponse(res, { token }, 'Login successful', 200);

};


// only Employee
exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return responseHandler.errorResponse(res, 'Email and password are required', 400);
  }

  const employee = await Employee.findOne({ where: { email, role: { [Sequelize.Op.ne]: 'ADMIN' } } });

  if (!employee) {
    return responseHandler.errorResponse(res, 'Invalid credentials', 401);
  }

  if (employee.isActivated === false) {
    return responseHandler.errorResponse(res, 'Your account is not activated', 403);
  }

  if (password !== employee.password) {
    return responseHandler.errorResponse(res, 'Invalid credentials', 401);
  }

  const token = jwt.sign({ id: employee.id, role: employee.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return responseHandler.successResponse(res, { token }, 'Login successful', 200);

};

// only Employee
exports.updateEmployeeDetail = async (req, res) => {
  const { email, username, firstName, lastName } = req.body;

  const employeeId = req?.employee?.id;
  console.log(employeeId, "employeeId")

  const employee = await Employee.findByPk(employeeId);

  if (!employee) {
    return responseHandler.errorResponse(res, 'Employee not found', 404);
  }

  const updatedEmployee = await employee.update({
    email: email || employee.email,
    username: username || employee.username,
    firstName: firstName || employee.firstName,
    lastName: lastName || employee.lastName
  });

  successResponse(res, updatedEmployee, 'Employee details updated successfully', 200);
};
