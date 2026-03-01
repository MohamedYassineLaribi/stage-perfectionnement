require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const offerRoutes = require('./routes/offerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes'); // Import
const activityRoutes = require('./routes/activityRoutes');
const leadRoutes = require('./routes/leadRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes); // Use
app.use('/api/activities', activityRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'API CRM APP en ligne' });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_app';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log(' Connecté à MongoDB');

        // Seed default admin user
        // Seed Permissions
        const permissionsList = [
            { name: 'manage_offers', description: 'Gérer les offres' },
            { name: 'manage_contacts', description: 'Gérer les contacts' },
            { name: 'manage_articles', description: 'Gérer les articles' },
            { name: 'manage_orders', description: 'Gérer les commandes' },
            { name: 'manage_roles', description: 'Gérer les rôles' },
            { name: 'manage_users', description: 'Gérer les utilisateurs' },
            { name: 'manage_invoices', description: 'Gérer les factures' },
            { name: 'manage_settings', description: 'Gérer les paramètres système' },
            { name: 'manage_activities', description: 'Gérer les activités' },
            { name: 'manage_leads', description: 'Gérer les leads' }
        ];

        for (const p of permissionsList) {
            await Permission.findOneAndUpdate({ name: p.name }, p, { upsert: true });
        }
        const allPermissions = await Permission.find({});
        const permIds = allPermissions.map(p => p._id);

        // Seed Roles
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            adminRole = await Role.create({
                name: 'Admin',
                description: 'Administrateur système avec tous les droits',
                permissions: permIds
            });
        } else {
            adminRole.permissions = permIds;
            await adminRole.save();
        }

        let commRole = await Role.findOne({ name: 'Commercial' });
        const commPermNames = ['manage_offers', 'manage_contacts', 'manage_articles', 'manage_orders', 'manage_activities', 'manage_leads'];
        const commPermIds = allPermissions.filter(p => commPermNames.includes(p.name)).map(p => p._id);

        if (!commRole) {
            commRole = await Role.create({
                name: 'Commercial',
                description: 'Utilisateur commercial avec droits limités',
                permissions: commPermIds
            });
        } else {
            commRole.permissions = commPermIds;
            await commRole.save();
        }

        // Seed default admin user
        const adminEmail = 'admin@crm.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await User.create({
                name: 'Administrateur',
                email: adminEmail,
                password: 'admin123',
                role: adminRole._id
            });
            console.log(' Admin créé: admin@crm.com / admin123');
        }

        // Seed default commercial user
        const commEmail = 'commercial@crm.com';
        const existingComm = await User.findOne({ email: commEmail });
        if (!existingComm) {
            await User.create({
                name: 'Commercial',
                email: commEmail,
                password: 'commercial123',
                role: commRole._id
            });
            console.log(' Commercial créé: commercial@crm.com / commercial123');
        }
    })
    .catch(err => {
        console.error(' Erreur de connexion MongoDB:', err.message);
        console.log(' Assurez-vous que MongoDB est installé et en cours d\'exécution sur ' + MONGODB_URI);
    });

// Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(` Serveur backend démarré sur http://localhost:${PORT}`);
});
