const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');

router.route('/')
    .get(protect, getOrders)
    .post(protect, authorize(['manage_orders']), createOrder);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, authorize(['manage_orders']), updateOrderStatus);

module.exports = router;
