const express = require('express');
const asyncHandler = require('../middlewares/catchAsyncError');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createDesignation, updateDesignation, deleteDesignation, getAllDesignations } = require('../controllers/designationController');

const router = express.Router();


router.post(
  '/designation',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(createDesignation)
);
router.put(
  '/update-designation',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(updateDesignation)
);
router.delete(
  '/delete-designation/:designationId',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(deleteDesignation)
);
router.get(
  '/designation',
  authMiddleware,
  asyncHandler(getAllDesignations)
);






module.exports = router;

