// controllers/leaveController.js
const { Op } = require('sequelize');
const { Leave, Employee } = require('../models');
const { errorResponse, successResponse } = require('../utils/responseHandler');

// Create a leave request
exports.createLeave = async (req, res) => {
  const { fromDate, toDate, leaveTitle, leaveType, description } = req.body;
  const employeeId = req.employee.id;
  const leave = await Leave.create({
    employeeId,
    fromDate,
    toDate,
    leaveTitle,
    leaveType,
    description,
  });
  successResponse(res, leave, 'Leave request created successfully', 201);

};

// My Leaves
exports.getSpecificEmployeeLeave = async (req, res) => {
  const { status, fromDate, toDate, page = 1, limit = 10 } = req.query;
  const employeeId = req?.employee?.id;

  const filters = {
    employeeId,
    isDeleted: false,
  };

  if (status) {
    filters.status = status;
  }

  if (fromDate || toDate) {
    filters.fromDate = {};

    if (fromDate) {
      filters.fromDate[Op.gte] = new Date(fromDate);
    }
    if (toDate) {
      filters.fromDate[Op.lte] = new Date(toDate);
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows: leaves } = await Leave.findAndCountAll({
    where: filters,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  });

  successResponse(res, {
    leaves,
    totalRecords: count,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(count / limit),
  }, 'Leaves fetched successfully', 200);

};

// Only Admin
// exports.getAllLeaves = async (req, res) => {
//   const { status, fromDate, toDate, page = 1, limit = 10, employeeName } = req.query;

//   const filters = {
//     isDeleted: false,
//   };

//   if (status) {
//     filters.status = status;
//   }

//   if (fromDate || toDate) {
//     filters.fromDate = {};

//     if (fromDate) {
//       filters.fromDate[Op.gte] = new Date(fromDate);
//     }
//     if (toDate) {
//       filters.fromDate[Op.lte] = new Date(toDate);
//     }
//   }

//   const offset = (page - 1) * limit;

//   const employeeWhere = employeeName
//     ? {
//       [Op.or]: [
//         { firstName: { [Op.like]: `%${employeeName}%` } },
//         { lastName: { [Op.like]: `%${employeeName}%` } },
//       ],
//     }
//     : {};

//   const { count, rows: leaves } = await Leave.findAndCountAll({
//     where: filters,
//     include: [
//       {
//         model: Employee,
//         as: 'employeeDetails', // Match this alias with the one defined in your association
//         attributes: ['firstName', 'lastName'],
//         where: employeeName
//           ? {
//             [Op.or]: [
//               { firstName: { [Op.like]: `%${employeeName}%` } },
//               { lastName: { [Op.like]: `%${employeeName}%` },
//                 ],
//           }
//           : undefined,
//       },
//     ],
//     limit: parseInt(limit, 10),
//     offset: parseInt(offset, 10),
//   });

//   successResponse(
//     res,
//     {
//       leaves,
//       totalRecords: count,
//       currentPage: parseInt(page, 10),
//       totalPages: Math.ceil(count / limit),
//     },
//     'All leaves fetched successfully',
//     200
//   );

// };

exports.getAllLeaves = async (req, res) => {
  const { page = 1, limit = 10, employeeName, status } = req.query;

  const offset = (page - 1) * limit;


  console.log(employeeName, status, "employeeName, status ")

  const whereClause = { isDeleted: false };

  // Add filters if provided
  if (status) {
    whereClause.status = status;
  }

  try {
    const { rows: leaves, count: totalLeaves } = await Leave.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employeeDetails',
          attributes: ['firstName', 'lastName'],
          where: employeeName
            ? {
              [Op.or]: [
                { firstName: { [Op.like]: `%${employeeName}%` } },
                { lastName: { [Op.like]: `%${employeeName}%` } }
              ],
            }
            : undefined,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    successResponse(res, { leaves, totalLeaves }, 'Leaves fetched successfully');
  } catch (error) {
    errorResponse(res, error.message || 'Failed to fetch leaves');
  }
};

exports.getSingleLeave = async (req, res) => {
  const { leaveId } = req.params;

  const leave = await Leave.findByPk(leaveId);

  if (!leave) {
    return errorResponse(res, `Leave with ID ${leaveId} not found`, 404);
  }

  successResponse(res, leave, `Leave with ID ${leaveId} fetched successfully`, 200);
};

exports.updateLeaveStatus = async (req, res) => {
  const { leaveId } = req.params;
  const { status, reason } = req.body;

  if (!['approved', 'disapproved'].includes(status)) {
    errorResponse(res, 'Invalid status provided', 400);
  }
  if (['approved', 'disapproved'].includes(status) && !reason) {
    errorResponse(res, 'Reason is required for approved or disapproved status', 400);
  }

  const leave = await Leave.findByPk(leaveId);

  if (!leave) {
    errorResponse(res, `Leave with ID ${leaveId} not found`, 404);
  }

  leave.status = status;
  leave.reason = reason || null;
  await leave.save();

  successResponse(
    res,
    leave,
    `Leave with ID ${leaveId} updated successfully to ${status}`,
    200
  );

};

// only Employee
exports.updateLeaveRequest = async (req, res) => {
  const { leaveTitle, leaveType, description, fromDate, toDate } = req.body;

  const leaveId = req.params.leaveId;
  const employeeId = req?.employee?.id;


  const leave = await Leave.findOne({
    where: { id: leaveId, employeeId: employeeId },
  });

  if (!leave) {
    errorResponse(res, 'Leave request not found or not authorized', 404);
  }

  if (fromDate && toDate && new Date(fromDate) >= new Date(toDate)) {
    errorResponse(res, "'fromDate' must be earlier than 'toDate'.", 400);
  }

  const updatedLeave = await leave.update({
    leaveTitle: leaveTitle || leave.leaveTitle,
    leaveType: leaveType || leave.leaveType,
    description: description || leave.description,
    fromDate: fromDate || leave.fromDate,
    toDate: toDate || leave.toDate,
  });

  successResponse(res, updatedLeave, 'Leave request updated successfully', 200);
};

// only Employee
exports.deleteLeave = async (req, res) => {
  const leaveId = req.params.leaveId;
  const employeeId = req?.employee?.id;

  const leave = await Leave.findOne({
    where: {
      id: leaveId,
      employeeId: employeeId,
      isDeleted: false,
    },
  });


  if (!leave) {
    return errorResponse(res, 'Leave request not found or not authorized', 404);
  }

  leave.isDeleted = true;
  await leave.save();

  successResponse(res, null, 'Leave request deleted successfully', 200);
};







