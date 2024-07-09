const express = require('express');
const router = express.Router();
const ArticleController = require('./articles.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/articles', authMiddleware, ArticleController.createArticle);
router.put('/articles/:id', authMiddleware, ArticleController.updateArticle);
router.delete('/articles/:id', authMiddleware, ArticleController.deleteArticle);
router.get('/users/:userId/articles', ArticleController.getUserArticles);

module.exports = router;
