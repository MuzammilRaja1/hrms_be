const jwt = require('jsonwebtoken');
const { Employee } = require('../models');
const { errorResponse } = require('../utils/responseHandler');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return errorResponse(res, 'Authentication token is missing', 401);
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.id);

    if (!employee) {
      return errorResponse(res, 'Employee not found', 404);
    }

    req.employee = employee;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = authMiddleware;
