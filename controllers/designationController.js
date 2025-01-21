// controllers/leaveController.js
const { Op } = require('sequelize');
const { Designation } = require('../models');
const { errorResponse, successResponse } = require('../utils/responseHandler');

exports.createDesignation = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    errorResponse(res, 'Designation name is required.', 400);
  }


  const existingDesignation = await Designation.findOne({
    where: { name }
  });

  if (existingDesignation) {
    return errorResponse(res, 'Designation already exists', 400);
  }

  const designation = await Designation.create({
    name: name,
    isDeleted: false,
  });

  successResponse(res, designation, 'Designation created successfully.', 201);
};

exports.updateDesignation = async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return errorResponse(res, 'Designation ID and name are required.', 400);
  }

  const designation = await Designation.findOne({
    where: { id }
  });

  if (!designation) {
    return errorResponse(res, 'Designation not found.', 404);
  }

  const existingDesignation = await Designation.findOne({
    where: { name, id: { [Op.ne]: id } }
  });

  if (existingDesignation) {
    return errorResponse(res, 'Designation name already exists.', 400);
  }

  designation.name = name;
  designation.updatedAt = new Date();
  await designation.save();

  successResponse(res, designation, 'Designation updated successfully.', 200);
};

exports.deleteDesignation = async (req, res) => {
  const { designationId } = req.params;

  if (!designationId) {
    return errorResponse(res, 'Designation ID is required.', 400);
  }

  const designation = await Designation.findOne({
    where: { id: designationId }
  });

  if (!designation) {
    return errorResponse(res, 'Designation not found.', 404);
  }

  designation.isDeleted = true;
  await designation.save();

  successResponse(res, null, 'Designation deleted successfully.', 200);

};

exports.getAllDesignations = async (req, res) => {
  const leaves = await Designation.findAll({
    where: { isDeleted: false }
  });
  successResponse(res, leaves, 'All designations fetched successfully');
};






