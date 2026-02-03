const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['Product', 'Service'],
        required: true
    },
    price: { type: Number, required: true }, // Prix de base
    stockString: { type: String }, // Pour gérer "100 unités", "Illimité" etc.
    stockQuantity: { type: Number }, // Quantité numérique pour suivi de stock
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
