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
    notifications: {
        emailNotif: { type: Boolean, default: true },
        pushNotif: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: false }
    },
    enterprise: {
        name: { type: String, default: 'CRM App' },
        vat: { type: String, default: '' },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        currency: { type: String, default: 'Euro (€)' }
    },
    emailConfig: {
        host: { type: String, default: 'smtp.crmapp.com' },
        user: { type: String, default: 'noreply@crmapp.com' },
        password: { type: String, default: '' },
        port: { type: Number, default: 587 },
        encryption: { type: String, default: 'TLS' }
    },
    backupConfig: {
        autoBackup: { type: Boolean, default: true },
        time: { type: String, default: '02:00' },
        retentionDays: { type: Number, default: 30 }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
