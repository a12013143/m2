const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * PetCategory Schema
 */

const PetCategorySchema = new Schema({
    name:{ type: String, default: '' },
    description: { type: String, default: 3 },
    articles: [{type: mongoose.ObjectId, ref: Pet}]
});

const PetCategory = mongoose.model('PetCategory', PetCategorySchema);

module.exports=PetCategory;