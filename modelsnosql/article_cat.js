const mongoose = require('mongoose');
const Article = require("../modelsnosql/article");
const Schema = mongoose.Schema;

/**
 * ArticleCategory Schema
 */

const ArticleCategorySchema = new Schema({
    _id:Number,
    name:{ type: String, default: '' },
    description: { type: String, default: 3 },
    articles: [{type: Number, ref: Article}]
},{ collection: 'article_cat' });

const ArticleCategory = mongoose.model('article_cat', ArticleCategorySchema);

module.exports=ArticleCategory;