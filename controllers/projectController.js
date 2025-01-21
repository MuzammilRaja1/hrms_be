const { Employee, Project } = require('../models');
const { errorResponse, successResponse } = require('../utils/responseHandler');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name && !description) {
    errorResponse(res, 'Project name and description is required.', 400);
  }


  const existingProject = await Project.findOne({
    where: { name }
  });

  if (existingProject) {
    return errorResponse(res, 'Project already exists', 400);
  }

  const projects = await Project.create({
    name: name,
    description,
    isActivated: true,
    isDeleted: false,
  });

  successResponse(res, projects, 'Project created successfully.', 201);
};

exports.getAllProjects = async (req, res) => {
  const projects = await Project.findAll({
    where: { isDeleted: false }
  });
  successResponse(res, projects, 'All project fetched successfully');
};

exports.assignProject = async (req, res) => {
  const { employeeId, projectId } = req.body;

  if (!employeeId && !projectId) {
    return errorResponse(res, 'Employee ID and Project ID are required', 400);
  }

  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    return errorResponse(res, 'Employee not found', 404);
  }

  const project = await Project.findByPk(projectId);
  if (!project) {
    errorResponse(res, 'Project not found', 404);
  }

  const isAlreadyAssigned = await employee.hasProject(project);
  if (isAlreadyAssigned) {
    return errorResponse(res, 'Project is already assigned to this employee', 400);
  }

  await employee.addProject(project);

  successResponse(res, null, 'Project assigned to employee successfully', 201);

};

exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  if (!projectId) {
    errorResponse(res, 'Project ID is required', 400);
  }
  const project = await Project.findByPk(projectId);
  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  const updatedProject = await project.update({
    name: name || project.name,
    description: description || project.description,
  });

  successResponse(res, updatedProject, 'Project updated successfully', 200);

};

exports.updateProjectActivation = async (req, res) => {
  const { projectId } = req.params;
  const { isActivated } = req.body;

  if (isActivated === undefined) {
    errorResponse(res, '`isActivated` value is required', 400);
  }

  const project = await Project.findByPk(projectId);

  if (!project) {
    errorResponse(res, 'Project not found', 404);
  }

  project.isActivated = isActivated;
  await project.save();

  successResponse(res, project, '`isActivated` updated successfully', 200);

};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    errorResponse(res, 'Project ID is required.', 400);
  }

  const project = await Project.findOne({
    where: { id: projectId }
  });

  if (!project) {
    errorResponse(res, 'Project not found.', 404);
  }

  project.isDeleted = true;
  await project.save();

  successResponse(res, null, 'Project deleted successfully.', 200);

};

