const Article = require('../models/Article');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Private
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Private
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an article
// @route   POST /api/articles
// @access  Private (Commercial/Admin)
const createArticle = async (req, res) => {
    try {
        const { name, type, price, stockString, stockQuantity, description } = req.body;
        const article = new Article({
            name,
            type,
            price,
            stockString,
            stockQuantity,
            description
        });
        const createdArticle = await article.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private (Commercial/Admin)
const updateArticle = async (req, res) => {
    try {
        const { name, type, price, stockString, stockQuantity, isActive, description } = req.body;
        const article = await Article.findById(req.params.id);

        if (article) {
            article.name = name || article.name;
            article.type = type || article.type;
            article.price = price || article.price;
            article.stockString = stockString || article.stockString;
            article.stockQuantity = stockQuantity !== undefined ? stockQuantity : article.stockQuantity;
            article.isActive = isActive !== undefined ? isActive : article.isActive;
            article.description = description || article.description;

            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private (Admin)
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.deleteOne();
            res.json({ message: 'Article supprimé' });
        } else {
            res.status(404).json({ message: 'Article non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
