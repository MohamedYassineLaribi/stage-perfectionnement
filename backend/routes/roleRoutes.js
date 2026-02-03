const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRoles, createRole, updateRole, deleteRole } = require('../controllers/roleController');
const { getPermissions } = require('../controllers/permissionController');

// Admin only helper
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.name === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé : Réservé aux administrateurs" });
    }
};

router.route('/')
    .get(protect, adminOnly, getRoles)
    .post(protect, adminOnly, createRole);

router.get('/permissions', protect, adminOnly, getPermissions);

router.route('/:id')
    .put(protect, adminOnly, updateRole)
    .delete(protect, adminOnly, deleteRole);

module.exports = router;
