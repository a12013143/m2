const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */

const UserSchema = new Schema({
    name:{ type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: Int16Array, default: 3 },
    //articles: [{type: mongoose.ObjectId, ref: User}],
    profile_img_url:  { type: String, default: '/images/repo/user.png' },
});

const User = mongoose.model('User', UserSchema);

module.exports=User;