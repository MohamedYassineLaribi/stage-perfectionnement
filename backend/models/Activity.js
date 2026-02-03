const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    subject: { type: String, required: true },
    type: {
        type: String,
        enum: ['Call', 'Meeting', 'Task', 'Email', 'Other'],
        default: 'Call'
    },
    description: { type: String },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    salesPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Planned', 'Completed', 'Cancelled'],
        default: 'Planned'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
