const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const Contact = require('./models/Contact');
const Article = require('./models/Article');
const Offer = require('./models/Offer');
const Order = require('./models/Order');
const Activity = require('./models/Activity');
const Settings = require('./models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/duralux_crm';

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB pour le seeding');

        // 1. Get Users
        const adminUser = await User.findOne({ email: 'admin@duralux.com' });
        const commUser = await User.findOne({ email: 'commercial@duralux.com' });

        if (!adminUser || !commUser) {
            console.error('❌ Utilisateurs non trouvés. Lancez d\'abord le serveur pour initialiser les comptes.');
            return;
        }

        // 2. Create Articles
        console.log('📦 Création des articles...');
        await Article.deleteMany({});
        const articles = await Article.insertMany([
            { name: 'Ordinateur Portable XPS', description: 'Dell XPS 13, 16GB RAM, 512GB SSD', type: 'Product', price: 1200, stockQuantity: 10, isActive: true },
            { name: 'Ecran 4K 27"', description: 'Ecran Ultra HD pour graphistes', type: 'Product', price: 450, stockQuantity: 25, isActive: true },
            { name: 'Installation Réseau', description: 'Service de configuration réseau entreprise', type: 'Service', price: 800, isActive: true },
            { name: 'Maintenance Mensuelle', description: 'Support technique et mises à jour', type: 'Service', price: 150, isActive: true }
        ]);

        // 3. Create Contacts
        console.log('👤 Création des contacts...');
        await Contact.deleteMany({});
        const contacts = await Contact.insertMany([
            { firstName: 'Alice', lastName: 'Martin', email: 'alice@techcorp.com', type: 'Company', companyName: 'TechCorp Solutions', phone: '0123456789', address: 'Paris, France', salesPerson: adminUser._id },
            { firstName: 'Bob', lastName: 'Bernard', email: 'bob@gmail.com', type: 'Person', phone: '0654321098', address: 'Lyon, France', salesPerson: commUser._id },
            { firstName: 'Charlie', lastName: 'Carlier', email: 'charlie@startup.io', type: 'Company', companyName: 'Innovate SA', phone: '0789456123', address: 'Nantes, France', salesPerson: commUser._id }
        ]);

        // 4. Create Offers
        console.log('📄 Création des offres...');
        await Offer.deleteMany({});

        // Offer for Admin
        const offer1 = await Offer.create({
            reference: 'OFF-ADM-001',
            title: 'Equipement Bureau Direction',
            client: contacts[0]._id,
            salesPerson: adminUser._id,
            offerType: 'Standard',
            status: 'accepted',
            items: [
                { article: articles[0]._id, description: articles[0].name, quantity: 2, unitPrice: 1200, discount: 5 },
                { article: articles[1]._id, description: articles[1].name, quantity: 2, unitPrice: 450, discount: 0 }
            ],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        // Offers for Commercial
        const offer2 = await Offer.create({
            reference: 'OFF-COM-001',
            title: 'Pack Maintenance Innovate',
            client: contacts[2]._id,
            salesPerson: commUser._id,
            offerType: 'Service',
            status: 'sent',
            items: [
                { article: articles[3]._id, description: articles[3].name, quantity: 12, unitPrice: 150, discount: 10 }
            ],
            validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        });

        const offer3 = await Offer.create({
            reference: 'OFF-COM-002',
            title: 'Installation Réseau Bob',
            client: contacts[1]._id,
            salesPerson: commUser._id,
            offerType: 'Service',
            status: 'converted',
            items: [
                { article: articles[2]._id, description: articles[2].name, quantity: 1, unitPrice: 800, discount: 0 }
            ],
            validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        });

        // 5. Create Orders (from offers)
        console.log('🛒 Création des commandes...');
        await Order.deleteMany({});
        await Order.create({
            reference: 'ORD-COM-001',
            sourceOffer: offer3._id,
            client: contacts[1]._id,
            salesPerson: commUser._id,
            status: 'confirmed',
            items: offer3.items,
            totalAmountHT: offer3.totalAmountHT,
            totalAmountTTC: offer3.totalAmountTTC
        });

        // 6. Create Activities
        console.log('📅 Création des activités...');
        await Activity.deleteMany({});
        await Activity.insertMany([
            { subject: 'Appel de suivi TechCorp', type: 'Call', contact: contacts[0]._id, salesPerson: adminUser._id, date: new Date(), status: 'completed', description: 'Discussion sur le devis' },
            { subject: 'Réunion découverte Innovate', type: 'Meeting', contact: contacts[2]._id, salesPerson: commUser._id, date: new Date(), status: 'planned', description: 'Besoin de maintenance' },
            { subject: 'Email configuration Bob', type: 'Email', contact: contacts[1]._id, salesPerson: commUser._id, date: new Date(), status: 'completed', description: 'Envoi des accès' }
        ]);

        console.log('✨ Données de démonstration créées avec succès !');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        process.exit(1);
    }
}

seedData();
