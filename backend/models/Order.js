const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true }, // e.g., ORD-2023-0001
    sourceOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }, // Offre d'origine
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    salesPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [{
        article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
        description: String,
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        totalLine: { type: Number }
    }],

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    billingAddress: String,
    shippingAddress: String,

    totalAmountHT: Number,
    totalAmountTTC: Number,

    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, // Lien vers facturation

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
