const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getInvoices,
    getInvoiceById,
    createInvoice,
    generateInvoicePdf // Import
} = require('../controllers/invoiceController');

router.route('/')
    .get(protect, authorize(['manage_invoices']), getInvoices)
    .post(protect, authorize(['manage_invoices']), createInvoice);

router.route('/:id')
    .get(protect, authorize(['manage_invoices']), getInvoiceById);

router.route('/:id/pdf').get(protect, authorize(['manage_invoices']), generateInvoicePdf); // New route

module.exports = router;
