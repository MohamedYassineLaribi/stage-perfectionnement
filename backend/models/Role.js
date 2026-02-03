const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // ex : 'Admin', 'Commercial'
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);
