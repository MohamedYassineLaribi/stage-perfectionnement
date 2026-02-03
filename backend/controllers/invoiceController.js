const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const PDFDocument = require('pdfkit');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
    try {
        let query = {};

        // If not Admin, only show invoices related to orders owned by the user
        // We need to find orders first or join (Mongoose find with filter on populated field is tricky without aggregation)
        if (req.user.role !== 'Admin' && req.user.role?.name !== 'Admin') {
            const userOrders = await Order.find({ salesPerson: req.user._id }).select('_id');
            const orderIds = userOrders.map(o => o._id);
            query.order = { $in: orderIds };
        }

        const invoices = await Invoice.find(query)
            .populate('client', 'companyName firstName lastName')
            .populate('order', 'reference');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client')
            .populate({
                path: 'order',
                populate: { path: 'items.article' }
            });

        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: 'Facture non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create invoice from order
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
    try {
        const { orderId, dueDate } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

        // Check if invoice already exists
        const existingInvoice = await Invoice.findOne({ order: orderId });
        if (existingInvoice) return res.status(400).json({ message: 'Une facture existe déjà pour cette commande' });

        const invoice = new Invoice({
            reference: `INV-${Date.now()}`,
            order: orderId,
            client: order.client,
            amountDue: order.totalAmountTTC,
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days default
            status: 'issued'
        });

        const createdInvoice = await invoice.save();

        // Update Order with invoice link
        order.invoice = createdInvoice._id;
        order.status = 'processing';
        await order.save();

        res.status(201).json(createdInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Generate PDF for invoice
// @route   GET /api/invoices/:id/pdf
// @access  Private
const generateInvoicePdf = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client')
            .populate({
                path: 'order',
                populate: { path: 'items.article' }
            });

        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }

        const doc = new PDFDocument();

        // Stream response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=facture-${invoice.reference}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('DURALUX', 110, 57)
            .fontSize(10).text('123 Avenue de la Rénovation', 200, 65, { align: 'right' })
            .text('75000 Paris, France', 200, 80, { align: 'right' })
            .moveDown();

        // Invoice Info
        doc.fontSize(16).text(`Facture N°: ${invoice.reference}`, 50, 150);
        doc.fontSize(10).text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 175);
        doc.text(`Client: ${invoice.client.companyName || invoice.client.firstName + ' ' + invoice.client.lastName}`, 50, 190);
        doc.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 205);

        // Table Header
        const tableTop = 250;
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, tableTop);
        doc.text('Qté', 280, tableTop, { width: 90, align: 'right' });
        doc.text('Prix Unit.', 370, tableTop, { width: 90, align: 'right' });
        doc.text('Total HT', 0, tableTop, { align: 'right' });

        const generateHr = (y) => {
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
        }
        generateHr(tableTop + 20);

        // Items
        let i = 0;
        doc.font('Helvetica');
        const items = invoice.order.items;

        for (i = 0; i < items.length; i++) {
            const item = items[i];
            const y = tableTop + 35 + (i * 25);
            doc.text(item.description, 50, y);
            doc.text(item.quantity, 280, y, { width: 90, align: 'right' });
            doc.text(item.unitPrice + ' €', 370, y, { width: 90, align: 'right' });
            doc.text(item.totalLine.toFixed(2) + ' €', 0, y, { align: 'right' });
            generateHr(y + 20);
        }

        // Total
        const subtotalPosition = tableTop + 35 + (items.length * 25) + 30;
        doc.font('Helvetica-Bold');
        doc.text('Total HT', 350, subtotalPosition, { width: 90, align: 'right' });
        doc.text(invoice.order.totalAmountHT.toFixed(2) + ' €', 0, subtotalPosition, { align: 'right' });

        doc.text('TVA (20%)', 350, subtotalPosition + 15, { width: 90, align: 'right' });
        doc.text((invoice.amountDue - invoice.order.totalAmountHT).toFixed(2) + ' €', 0, subtotalPosition + 15, { align: 'right' });

        doc.fontSize(14).text('Total TTC', 350, subtotalPosition + 35, { width: 90, align: 'right' });
        doc.text(invoice.amountDue.toFixed(2) + ' €', 0, subtotalPosition + 35, { align: 'right' });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    generateInvoicePdf
};
