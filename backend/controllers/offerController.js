const Offer = require('../models/Offer');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Settings = require('../models/Settings');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private
const getOffers = async (req, res) => {
    try {
        const query = req.user.role?.name === 'Admin' ? {} : { salesPerson: req.user._id };
        const offers = await Offer.find(query)
            .populate('client', 'companyName firstName lastName email')
            .populate('salesPerson', 'name email');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private
const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('client')
            .populate('salesPerson')
            .populate('items.article');

        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ message: 'Offre non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private
const createOffer = async (req, res) => {
    try {
        const { reference, title, client, items, validUntil, notes } = req.body;

        const offer = new Offer({
            reference,
            title,
            client,
            salesPerson: req.user._id, // Assigné à l'utilisateur connecté
            items,
            validUntil,
            notes
        });

        const createdOffer = await offer.save();
        res.status(201).json(createdOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private
const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            const oldStatus = offer.status;
            Object.assign(offer, req.body);
            const updatedOffer = await offer.save();

            // Auto-Convert Logic
            if (oldStatus !== 'accepted' && updatedOffer.status === 'accepted') {
                const settings = await Settings.findOne();
                if (settings && settings.workflow.autoConvert) {
                    const fullOffer = await Offer.findById(updatedOffer._id).populate('items.article');
                    await performOfferToOrderConversion(fullOffer, req.user._id);
                }
            }

            res.json(updatedOffer);
        } else {
            res.status(404).json({ message: 'Offre non trouvée' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await offer.deleteOne();
            res.json({ message: 'Offre supprimée' });
        } else {
            res.status(404).json({ message: 'Offre non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper for offer to order conversion
const performOfferToOrderConversion = async (offer, userId) => {
    if (offer.status === 'converted') return null;

    const orderRef = `ORD-${Date.now()}`;
    const order = new Order({
        reference: orderRef,
        sourceOffer: offer._id,
        client: offer.client,
        salesPerson: userId,
        items: offer.items.map(item => ({
            article: item.article._id || item.article,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            totalLine: item.totalLine
        })),
        totalAmountHT: offer.totalHT || offer.totalAmountHT,
        totalAmountTTC: offer.totalTTC || offer.totalAmountTTC,
        status: 'pending'
    });

    const createdOrder = await order.save();

    const settings = await Settings.findOne();
    if (settings && settings.workflow.autoInvoice) {
        const invoice = new Invoice({
            reference: `INV-${Date.now()}`,
            order: createdOrder._id,
            client: createdOrder.client,
            amountDue: createdOrder.totalAmountTTC,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'issued'
        });
        const createdInvoice = await invoice.save();
        createdOrder.invoice = createdInvoice._id;
        createdOrder.status = 'confirmed';
        await createdOrder.save();
    }

    offer.status = 'converted';
    await offer.save();
    return createdOrder;
};

// @desc    Convert offer to order
// @route   POST /api/offers/:id/convert
// @access  Private
const convertOfferToOrder = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id).populate('items.article');

        if (!offer) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        const order = await performOfferToOrderConversion(offer, req.user._id);
        if (!order) {
            return res.status(400).json({ message: 'Cette offre a déjà été convertie.' });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    convertOfferToOrder // Export
};
