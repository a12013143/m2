const mongoose = require('mongoose');
const User = require("../models/user");
const Article = require("../models/article");
const Schema = mongoose.Schema;

/**
 * Analytics Schema
 */


const AnalyticsSchema = new Schema({
    //_id:Number,
    name:{ type: String, default: '' },
    url:{ type: String, default: '' },
    userID: {type:String, default: null},
    pageID: {type: String, default: null},
    time: {type: Number},
    created_at:  { type: String},
},{ collection: 'analytics' });

const Analytics = mongoose.model('analytics', AnalyticsSchema);

module.exports= Analytics;