const mongoose = require('mongoose');
const User = require("../models/user");
const Schema = mongoose.Schema;

/**
 * Analytics Schema
 */

const AnalyticsSchema = new Schema({
    name:{ type: String, default: '' },
    url:{ type: String, default: '' },
    userID: {type: Number, ref: User},
    pageID: {type: Number},
    time: {type: Number},
    created_at:  { type: String, default: Date.now },
},{ collection: 'analytics' },{_id:false});

const Analytics = mongoose.model('analytics', AnalyticsSchema);

module.exports= Analytics;