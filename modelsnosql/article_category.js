const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ArticleCategory Schema
 */

const ArticleCategorySchema = new Schema({
    name:{ type: String, default: '' },
    description: { type: String, default: 3 },
    articles: [{type: mongoose.ObjectId, ref: Article}]
});

const ArticleCategory = mongoose.model('ArticleCategory', ArticleCategorySchema);

module.exports=ArticleCategory;