const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true }, // e.g., OFF-2023-0001
    title: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    salesPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offerType: { type: String, default: 'Standard' },

    items: [{
        article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
        description: String, // Copie au cas où l'article change
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true }, // Prix au moment de l'offre
        discount: { type: Number, default: 0 }, // % de remise
        totalLine: { type: Number } // Calculé
    }],

    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'converted'],
        default: 'draft'
    },

    totalAmountHT: { type: Number, default: 0 },
    taxRate: { type: Number, default: 20 }, // TVA 20% par défaut
    totalAmountTTC: { type: Number, default: 0 },

    validUntil: { type: Date },
    notes: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware pour calculer les totaux avant sauvegarde
offerSchema.pre('save', function (next) {
    let totalHT = 0;
    this.items.forEach(item => {
        const lineTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        item.totalLine = lineTotal;
        totalHT += lineTotal;
    });
    this.totalAmountHT = totalHT;
    this.totalAmountTTC = totalHT * (1 + this.taxRate / 100);
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Offer', offerSchema);
