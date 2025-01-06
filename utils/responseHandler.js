module.exports = {
  successResponse: (res, data = {}, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  errorResponse: (res, error = 'Something went wrong', statusCode = 500) => {
    res.status(statusCode).json({
      success: false,
      message: typeof error === 'string' ? error : error.message,
    });
  },
};
