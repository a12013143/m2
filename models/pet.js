const mongoose = require('mongoose');
var User = require('../models/user.js');
var PetCategory = require('../models/pet_category.js');
const Schema = mongoose.Schema;

/**
 * Pet Schema
 */

const PetSchema = new Schema({
    ID:{ type: Number, default: '' },
    // _id:Number,
    name:{ type: String, default: '' },
    address: { type: String, default: '' },
    neutered: { type: Number, default: 3 },
    age_year: { type: Number, default: null },
    age_month: { type: Number, default: null },
    short_desc: { type: String, default: 3 },
    description: { type: String, default: 3 },
    created_at:  { type: String, default: Date.now },
    updated_at:  { type: String, default: Date.now },
    profile_img_url:  { type: String, default: "/images/petcare-large.jpg" },
    categoryID :{type: Number},
    ownerID :{type: Number, ref: User},
    favourited_by: [{type: Number, ref: User}],   
    adoptions: [new mongoose.Schema(
        {
            // _id:Number,
            ID:{ type: Number, default: '' },
            userID: {type:Number},
            description: { type: String, default: '' },
            status:{ type: String, default: 'Initiated' },
            created_at: { type: String, default: Date.now },
            updated_at: { type: String, default: Date.now }
        })
    ]
},{ collection: 'pet' });



const Pet = mongoose.model('pet', PetSchema);

module.exports=Pet;