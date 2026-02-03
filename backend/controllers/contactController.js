const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
    try {
        const query = req.user.role?.name === 'Admin' ? {} : { salesPerson: req.user._id };
        const contacts = await Contact.find(query).populate('salesPerson', 'name email');
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).populate('salesPerson');
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).json({ message: 'Contact non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
    try {
        const contact = new Contact({
            ...req.body,
            salesPerson: req.user._id
        });
        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            Object.assign(contact, req.body);
            const updatedContact = await contact.save();
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            await contact.deleteOne();
            res.json({ message: 'Contact supprimé' });
        } else {
            res.status(404).json({ message: 'Contact non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
