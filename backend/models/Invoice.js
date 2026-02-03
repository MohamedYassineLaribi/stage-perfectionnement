const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true }, // e.g., INV-2023-0001
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },

    status: {
        type: String,
        enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled'],
        default: 'draft'
    },

    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    dueDate: { type: Date },
    paidAt: { type: Date },

    paymentMethod: { type: String }, // 'Stripe', 'Bank Transfer', 'Check'

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
