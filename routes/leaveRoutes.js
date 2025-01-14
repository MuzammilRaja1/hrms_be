const express = require('express');
const asyncHandler = require('../middlewares/catchAsyncError');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createLeave, getAllLeaves, getSpecificEmployeeLeave, getSingleLeave, updateLeaveStatus, deleteLeave, updateLeaveRequest } = require('../controllers/leaveController');

const router = express.Router();


router.post(
  '/create-leave',
  authMiddleware,
  asyncHandler(createLeave)
);
router.put(
  '/update-leave/:leaveId',
  authMiddleware,
  asyncHandler(updateLeaveRequest)
);
router.get(
  '/my-leaves',
  authMiddleware,
  asyncHandler(getSpecificEmployeeLeave)
);
router.get(
  '/all-leaves',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(getAllLeaves)
);
router.get(
  '/:leaveId',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(getSingleLeave)
);
router.patch(
  '/:leaveId/status',
  authMiddleware,
  roleMiddleware('ADMIN', 'HR'),
  asyncHandler(updateLeaveStatus)
);
router.patch(
  'delete/:leaveId/',
  authMiddleware,
  asyncHandler(deleteLeave)
);



module.exports = router;

