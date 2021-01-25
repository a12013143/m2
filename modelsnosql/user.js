const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */

const UserSchema = new Schema({
    _id:Number,
    name:{ type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, default: 'General' },
    //articles: [{type: mongoose.ObjectId, ref: User}],
    profile_img_url:  { type: String, default: '/images/repo/user.png' },
}, { collection: 'user' });

const User = mongoose.model('user', UserSchema);

module.exports=User;