module.exports = (requiredRole) => {
  return (req, res, next) => {
    const employeeRole = req.employee.role;
    if (employeeRole !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have the required permissions',
      });
    }
    next();
  };
};
