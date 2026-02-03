const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const query = req.user.role?.name === 'Admin' ? {} : { salesPerson: req.user._id };
        const orders = await Order.find(query)
            .populate('client', 'companyName firstName lastName')
            .populate('salesPerson', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client')
            .populate('salesPerson')
            .populate('items.article')
            .populate('sourceOffer');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Ordre non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an order (usually from Offer, but can be manual)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            salesPerson: req.user._id
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Ordre non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};
