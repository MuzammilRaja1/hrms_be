const logger = {
  info: (message) => {
    console.log(`[INFO]: ${message}`);
  },
  error: (error) => {
    console.error(`[ERROR]: ${error.message || error}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG]: ${message}`);
    }
  },
};

module.exports = logger;
