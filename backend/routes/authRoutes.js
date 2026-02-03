const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role'); // Import Role
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @access  Private/Admin (Only admin can create users)
router.post('/register', protect, async (req, res) => {
    if (req.user.role?.name !== 'Admin') {
        return res.status(403).json({ message: "Seul l'administrateur peut créer des utilisateurs" });
    }
    try {
        const { name, email, password, roleName } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Utilisateur déjà existant' });


        // Gestion du Rôle (Admin peut choisir, sinon Commercial par défaut)
        let role = await Role.findOne({ name: roleName || 'Commercial' });
        if (!role && !roleName) {
            role = await Role.create({
                name: 'Commercial',
                description: 'Rôle commercial par défaut'
            });
        } else if (!role) {
            return res.status(404).json({ message: 'Rôle spécifié introuvable' });
        }

        user = new User({
            name,
            email,
            password,
            role: role._id
        });
        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('role');

        if (user && (await user.comparePassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            // email is usually not changeable in simple setups
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
