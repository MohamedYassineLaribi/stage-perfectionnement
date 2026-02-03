const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

router.route('/')
    .get(protect, getContacts)
    .post(protect, authorize(['manage_contacts']), createContact);

router.route('/:id')
    .get(protect, getContactById)
    .put(protect, authorize(['manage_contacts']), updateContact)
    .delete(protect, authorize(['manage_contacts']), deleteContact);

module.exports = router;
