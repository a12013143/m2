const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * PetCategory Schema
 */

const PetCategorySchema = new Schema({
    ID:{ type: Number, default: '' },
    name:{ type: String, default: '' },
    description: { type: String, default: 3 }
},{ collection: 'pet_category' });

const PetCategory = mongoose.model('pet_category', PetCategorySchema);

module.exports=PetCategory;