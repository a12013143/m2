const mongoose = require('mongoose');
const User = require("../modelsnosql/user");
const Schema = mongoose.Schema;

/**
 * Analytics Schema
 */

const AnalyticsSchema = new Schema({
    _id:Number,
    name:{ type: String, default: '' },
    userID: {type: Number, ref: User},
    neutered: { type: Number, default: 3 },
    age_year: { type: Number, default: null },
    age_month: { type: Number, default: null },
    short_desc: { type: String, default: 3 },
    description: { type: String, default: 3 },
    created_at:  { type: String, default: Date.now },
    updated_at:  { type: String, default: Date.now },
    profile_img_url:  { type: String, default: 3 }
},{ collection: 'analytics' });

const Analytics = mongoose.model('analytics', AnalyticsSchema);

module.exports= Analytics;