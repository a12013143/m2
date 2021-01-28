const mongoose = require('mongoose');
const User = require("../models/user");
const Article = require("../models/article");
const Schema = mongoose.Schema;

/**
 * Analytics Schema
 */


const AnalyticsSchema = new Schema({
    // ID:{ type: Number, default: '' },
    //_id:Number,
    url:{ type: String, default: '' },
    userID: {type:Number, default: null},
    pageID: {type: Number, default: null},
    time: {type: Number},
    created_at:  { type: String},
},{ collection: 'analytics' });

const Analytics = mongoose.model('analytics', AnalyticsSchema);

module.exports= Analytics;