const Permission = require('../models/Permission');

// @desc    Get all permissions
const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find({});
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPermissions
};
