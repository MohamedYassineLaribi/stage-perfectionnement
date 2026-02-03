const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    activityTypes: {
        type: [String],
        default: ['Appel', 'Email', 'Réunion', 'Note']
    },
    offerStatuses: {
        type: [String],
        default: ['draft', 'sent', 'accepted', 'rejected', 'converted']
    },
    offerTypes: {
        type: [String],
        default: ['Standard', 'Récursion', 'Service', 'Produit']
    },
    orderStatuses: {
        type: [String],
        default: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    workflow: {
        autoInvoice: { type: Boolean, default: false },
        autoConvert: { type: Boolean, default: false },
        strictRoles: { type: Boolean, default: true }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
