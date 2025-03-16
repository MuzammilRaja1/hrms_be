const cron = require('node-cron');
const { Employee } = require('./models');

const updateMonthlyLeaveBalance = async () => {
  try {
    const employees = await Employee.findAll({ where: { isActivated: true } });

    for (let employee of employees) {
      employee.leaveBalance += 1;
      await employee.save();
    }

    console.log('Leave balance updated for active employees');
  } catch (error) {
    console.error('Error updating leave balance:', error);
  }
};

cron.schedule('0 0 1 * *', updateMonthlyLeaveBalance);
// cron.schedule('*/1 * * * *', updateMonthlyLeaveBalance);


module.exports = { updateMonthlyLeaveBalance };
