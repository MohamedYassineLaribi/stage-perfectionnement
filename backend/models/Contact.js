const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Person', 'Company'],
        required: true
    },
    // Champs communs
    email: { type: String },
    phone: { type: String },
    address: { type: String },

    // Champs spécifiques Person
    firstName: { type: String },
    lastName: { type: String },

    // Champs spécifiques Company
    companyName: { type: String },
    taxId: { type: String }, // Numéro fiscal

    salesPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Commercial assigné
    createdAt: { type: Date, default: Date.now }
});

// Virtual for full name or display name
contactSchema.virtual('displayName').get(function () {
    if (this.type === 'Company') {
        return this.companyName;
    }
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Contact', contactSchema);
