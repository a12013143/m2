const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Article Schema
 */

const ArticleSchema = new Schema({
    name:{ type: String, default: '' },
    userID: {type: mongoose.ObjectId, ref: User},
    neutered: { type: Int16Array, default: 3 },
    age_year: { type: Int16Array, default: null },
    age_month: { type: Int16Array, default: null },
    short_desc: { type: String, default: 3 },
    description: { type: String, default: 3 },
    created_at:  { type: String, default: Date.now },
    updated_at:  { type: String, default: Date.now },
    profile_img_url:  { type: String, default: 3 }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports= Article;