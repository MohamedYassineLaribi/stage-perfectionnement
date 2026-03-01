const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_app';

async function reset() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await User.deleteOne({ email: 'commercial@crm.com' });
        console.log('Deleted commercial user:', result.deletedCount);

        console.log('Now restart the backend to trigger the seeding logic.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

reset();
