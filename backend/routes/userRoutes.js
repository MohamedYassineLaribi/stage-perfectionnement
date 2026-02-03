const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');

// All routes here should be Admin only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.name === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé : Réservé aux administrateurs" });
    }
};

router.route('/')
    .get(protect, adminOnly, getUsers);

router.route('/:id')
    .put(protect, adminOnly, updateUser)
    .delete(protect, adminOnly, deleteUser);

module.exports = router;
