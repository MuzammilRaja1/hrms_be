const logger = require('../utils/logger');


const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error(error);
      next(error);
    });
  };
};

module.exports = asyncHandler;
