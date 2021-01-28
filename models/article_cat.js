const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ArticleCategory Schema
 */

const ArticleCategorySchema = new Schema({
    ID:{ type: Number, default: '' },
    // _id:Number,
    name:{ type: String, default: '' },
    description: { type: String, default: 3 }
},{ collection: 'article_cat' });

const ArticleCategory = mongoose.model('article_cat', ArticleCategorySchema);

module.exports=ArticleCategory;