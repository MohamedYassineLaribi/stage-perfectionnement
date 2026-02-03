const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');

router.route('/')
    .get(protect, getArticles)
    .post(protect, authorize(['manage_articles']), createArticle);

router.route('/:id')
    .get(protect, getArticleById)
    .put(protect, authorize(['manage_articles']), updateArticle)
    .delete(protect, authorize(['manage_articles']), deleteArticle);

module.exports = router;
