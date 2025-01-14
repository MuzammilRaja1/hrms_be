// controllers/leaveController.js
const { Leave } = require('../models');
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
  const leaves = await Leave.findAll({
    where: { employeeId: req?.employee?.id, isDeleted: false },
  });
  successResponse(res, leaves, 'All leaves fetched successfully', 201);
};


// Only Admin
exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.findAll({
    where: { isDeleted: false }
  });
  successResponse(res, leaves, 'All leaves fetched successfully');
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





