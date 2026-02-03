const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity
} = require('../controllers/activityController');

router.route('/')
    .get(protect, getActivities)
    .post(protect, authorize(['manage_activities']), createActivity);

router.route('/:id')
    .put(protect, authorize(['manage_activities']), updateActivity)
    .delete(protect, authorize(['manage_activities']), deleteActivity);

module.exports = router;
