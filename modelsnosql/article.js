const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../modelsnosql/user");
var ArticleCategory = require('../modelsnosql/article_cat.js');

/**
 * Article Schema
 */

const ArticleSchema = new Schema({
    _id:Number,
    name:{ type: String, default: '' },
    userID: {type: Number, ref: User},
    categoryID :{type: Number, ref: ArticleCategory},
    age_year: { type: Number, default: null },
    age_month: { type: Number, default: null },
    short_desc: { type: String, default: 3 },
    description: { type: String, default: 3 },
    created_at:  { type: String, default: Date.now },
    updated_at:  { type: String, default: Date.now },
    profile_img_url:  { type: String, default: 3 }
},{ collection: 'article' });

const Article = mongoose.model('article', ArticleSchema);

module.exports= Article;