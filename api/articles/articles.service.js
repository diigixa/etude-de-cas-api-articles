const Article = require('./articles.schema');

class ArticleService {
  async createArticle(data) {
    const article = new Article(data);
    return await article.save();
  }

  async updateArticle(id, data) {
    return await Article.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteArticle(id) {
    return await Article.findByIdAndDelete(id);
  }

  async getUserArticles(userId) {
    return await Article.find({ user: userId }).populate('user', '-password');
  }
}

module.exports = new ArticleService();
