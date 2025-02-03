const express = require('express');
const asyncHandler = require('../middlewares/catchAsyncError');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createProject, getAllProjects, assignProject, updateProject, updateProjectActivation, deleteProject } = require('../controllers/projectController');

const router = express.Router();


router.post(
  '/create-project',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(createProject)
);

router.post(
  '/assign-project',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(assignProject)
);

router.get(
  '/projects',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(getAllProjects)
);

router.put(
  '/update/:projectId',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(updateProject)
);

router.put(
  '/update-status/:projectId',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(updateProjectActivation)
);

router.delete(
  '/delete-project/:projectId',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(deleteProject)
);


module.exports = router;
