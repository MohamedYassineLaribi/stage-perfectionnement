const Role = require('../models/Role');
const Permission = require('../models/Permission');

// @desc    Get all roles
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({}).populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a role
const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const role = new Role({ name, description, permissions });
        const createdRole = await role.save();
        res.status(201).json(createdRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a role
const updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            role.name = req.body.name || role.name;
            role.description = req.body.description || role.description;
            role.permissions = req.body.permissions || role.permissions;
            const updatedRole = await role.save();
            res.json(updatedRole);
        } else {
            res.status(404).json({ message: 'Rôle non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a role
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            await role.deleteOne();
            res.json({ message: 'Rôle supprimé' });
        } else {
            res.status(404).json({ message: 'Rôle non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};
