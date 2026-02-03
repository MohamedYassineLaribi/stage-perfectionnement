const Activity = require('../models/Activity');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const query = req.user.role.name === 'Admin' ? {} : { salesPerson: req.user._id };
        const activities = await Activity.find(query)
            .populate('contact', 'firstName lastName companyName')
            .populate('salesPerson', 'name');
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
    try {
        const activity = new Activity({
            ...req.body,
            salesPerson: req.user._id
        });
        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            Object.assign(activity, req.body);
            const updatedActivity = await activity.save();
            res.json(updatedActivity);
        } else {
            res.status(404).json({ message: 'Activité non trouvée' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            await activity.deleteOne();
            res.json({ message: 'Activité supprimée' });
        } else {
            res.status(404).json({ message: 'Activité non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity
};
