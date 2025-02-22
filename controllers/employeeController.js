const { Employee, Designation, Project } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse } = require('../utils/responseHandler');
const jwtConfig = require('../config/jwtConfig');
const responseHandler = require('../utils/responseHandler');
const { Sequelize } = require('sequelize');


// only admin
exports.getAllEmployee = async (req, res) => {

  const employees = await Employee.findAll({
    include: [
      {
        model: Designation,
        as: 'designationDetails',
      },
    ],
  });

  successResponse(res, employees, 'Employee fetched successfully', 200);

};

// only admin
exports.createEmployee = async (req, res) => {
  const { email, phoneNumber, role, designationId, firstName, lastName, joiningDate } = req.body;

  const existingEmployee = await Employee.findOne({ where: { email } });
  if (existingEmployee) {
    return res.status(400).json({ error: 'Email already exists' });
  }


  const employee = await Employee.create({
    email,
    phoneNumber,
    role,
    designationId,
    password: "Test1234",
    joiningDate,
    firstName,
    lastName,
    isActivated: true,
  });
  console.log(employee, "===employee")

  successResponse(res, employee, 'Employee created successfully', 201);

};

// only admin
exports.updateEmployeeDetailAdmin = async (req, res) => {
  const { email, username, firstName, lastName } = req.body;
  const adminId = req?.admin?.id;
  const targetEmployeeId = req.params.id;

  if (!adminId || !targetEmployeeId) {
    return errorResponse(res, 'Unauthorized access', 403);
  }

  const employee = await Employee.findOne({
    where: { id: targetEmployeeId}
  });

  if (!employee) {
    return errorResponse(res, 'Employee not found or access denied', 404);
  }

  const updatedEmployee = await employee.update({
    email: email || employee.email,
    username: username || employee.username,
    firstName: firstName || employee.firstName,
    lastName: lastName || employee.lastName
  });

  return successResponse(res, updatedEmployee, 'Employee details updated successfully', 200);
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
    return responseHandler.errorResponse(res, 'Invalid credentials', 400);
  }

  if (employee.isActivated === false) {
    return responseHandler.errorResponse(res, 'Your account is not activated', 403);
  }

  if (password !== employee.password) {
    return responseHandler.errorResponse(res, 'Invalid credentials', 400);
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


exports.getEmployeeProjects = async (req, res) => {
  const employeeId = req.employee.id;

  const employee = await Employee.findByPk(employeeId, {
    include: [
      {
        model: Project,
        as: 'projects',
        attributes: ['id', 'name', 'description', 'isActivated'],
      },
    ],
  });

  if (!employee) {
    errorResponse(res, 'Employee not found', 404);
  }

  successResponse(res, employee.projects, 'Projects fetched successfully', 200);

};

