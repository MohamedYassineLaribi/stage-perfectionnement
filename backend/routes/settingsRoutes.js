const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Helper to ensure only Admin can update settings
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.name === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé : Seul l'administrateur peut modifier les paramètres système" });
    }
};

router.route('/')
    .get(protect, getSettings)
    .put(protect, adminOnly, updateSettings);

module.exports = router;
