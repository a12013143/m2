const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Pet Schema
 */

const PetSchema = new Schema({
    name:{ type: String, default: '' },
    address: { type: String, default: '' },
    neutered: { type: Int16Array, default: 3 },
    age_year: { type: Int16Array, default: null },
    age_month: { type: Int16Array, default: null },
    short_desc: { type: String, default: 3 },
    description: { type: String, default: 3 },
    created_at:  { type: String, default: Date.now },
    updated_at:  { type: String, default: Date.now },
    profile_img_url:  { type: String, default: 3 },
    favourited_by: [{type: mongoose.ObjectId, ref: User}],   
    adoption: [
        {
            userID: {type: mongoose.ObjectId, ref: User},
            description: { type: String, default: '' },
            status:{ type: String, default: 'Initiated' },
            created_at: { type: String, default: Date.now },
            updated_at: { type: String, default: Date.now }
        }
    ]
});

const Pet = mongoose.model('Pet', PetSchema);

module.exports=Pet;