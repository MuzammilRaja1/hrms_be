const { Employee } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorResponse, successResponse } = require('../utils/responseHandler');
const jwtConfig = require('../config/jwtConfig');
const responseHandler = require('../utils/responseHandler');



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
    lastName
  });
  successResponse(res, employee, 'Employee created successfully', 201);

};

exports.createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Employee.findOne({ where: { email: 'admin@example.com' } });

    if (!existingAdmin) {
      await Employee.create({
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        password: 'admin123',
        firstName: "Muzz",
        lastName: "SuperSoft",
        deletedAt: 1
      });

      console.log('Default admin created successfully!');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

// only admin
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Email and password are required', 400);
  }
  const sanitizedEmail = email.trim().toLowerCase();
  const employee = await Employee.findOne({ where: { email: sanitizedEmail } });

  if (!employee) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  if (password !== employee.password) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  successResponse(res, 'Login successful', { token });
};



// Employee login logic
exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return responseHandler.errorResponse(res, 'Email and password are required', 400);
  }

  try {
    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return responseHandler.errorResponse(res, 'Invalid credentials', 401);
    }

    // const isMatch = await bcrypt.compare(password, employee.password);

    if (password !== employee.password) {
      return responseHandler.errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ id: employee.id, role: employee.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return responseHandler.successResponse(res, { token }, 'Login successful', 200);
  } catch (err) {
    console.error(err);
    return responseHandler.errorResponse(res, 'Something went wrong', 500);
  }
};