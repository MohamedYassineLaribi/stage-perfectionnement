const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    convertOfferToOrder
} = require('../controllers/offerController');

router.route('/')
    .get(protect, getOffers)
    .post(protect, authorize(['manage_offers']), createOffer);

router.route('/:id')
    .get(protect, getOfferById)
    .put(protect, authorize(['manage_offers']), updateOffer)
    .delete(protect, authorize(['manage_offers']), deleteOffer);

router.route('/:id/convert').post(protect, authorize(['manage_offers']), convertOfferToOrder);

module.exports = router;
