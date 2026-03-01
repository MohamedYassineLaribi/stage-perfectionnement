const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_app';

async function verify() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log(' Connected to MongoDB');

        const user = await User.findOne({ email: 'commercial@crm.com' }).populate('role');

        if (!user) {
            console.log(' Result: User "commercial@crm.com" NOT FOUND in database.');
            return;
        }

        console.log(' User found:', user.email);
        console.log(' Role:', (user.role ? user.role.name : 'NONE'));
        console.log(' Hashed Password in DB:', user.password);

        const isPasswordCorrect = await user.comparePassword('commercial123');
        console.log(' Password check for "commercial123":', isPasswordCorrect ? 'MATCH ' : 'NO MATCH ');

        if (isPasswordCorrect && user.role && user.role.name === 'Commercial') {
            console.log('RESULT: SUCCESS - User is valid and credentials work.');
        } else {
            console.log(' RESULT: FAILED_CHECKS - Either password mismatch or role issue.');
        }
    } catch (err) {
        console.error(' Error:', err.message);
        console.log('RESULT: CONNECTION_ERROR');
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

verify();
