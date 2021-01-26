const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * PetCategory Schema
 */

const PetCategorySchema = new Schema({
    _id:Number,
    name:{ type: String, default: '' },
    description: { type: String, default: 3 }
},{ collection: 'pet_category' });

const PetCategory = mongoose.model('pet_category', PetCategorySchema);

module.exports=PetCategory;