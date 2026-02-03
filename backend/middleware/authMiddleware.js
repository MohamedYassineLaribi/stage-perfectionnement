const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token || token === 'undefined' || token === 'null') {
                return res.status(401).json({ message: 'Non autorisé, jeton manquant ou invalide' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password').populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

            if (!user) {
                return res.status(401).json({ message: 'Non autorisé, utilisateur introuvable' });
            }

            req.user = user;
            return next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            return res.status(401).json({ message: 'Non autorisé, jeton invalide' });
        }
    }

    return res.status(401).json({ message: 'Non autorisé, aucun jeton trouvé' });
};

const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Accès refusé : Rôle non attribué" });
        }

        // Si c'est un Admin, on autorise tout (optionnel, selon règles métier)
        if (req.user.role.name === 'Admin') {
            return next();
        }

        const userPermissions = req.user.role.permissions.map(p => p.name);
        // Vérifie si l'utilisateur a au moins une des permissions requises (ou toutes, selon besoin. Ici : au moins une)
        // Pour être plus strict (toutes les permissions), utiliser : requiredPermissions.every(...)
        // Ici on suppose que requiredPermissions est un tableau de droits nécessaires.

        // Si requiredPermissions est un tableau, on vérifie l'inclusion.
        const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));

        if (!hasPermission) {
            return res.status(403).json({ message: "Accès refusé : Permissions insuffisantes" });
        }
        next();
    };
};

module.exports = { protect, authorize };
