const ArticleService = require('./articles.service');

class ArticleController {
  async createArticle(req, res) {
    try {
      const article = await ArticleService.createArticle({ ...req.body, user: req.user._id });
      res.status(201).json(article);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateArticle(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      const article = await ArticleService.updateArticle(req.params.id, req.body);
      res.status(200).json(article);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteArticle(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      await ArticleService.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getUserArticles(req, res) {
    try {
      const articles = await ArticleService.getUserArticles(req.params.userId);
      res.status(200).json(articles);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ArticleController();
