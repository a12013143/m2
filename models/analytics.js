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
    userID: {type:Schema.Types.ObjectId, ref: User},
    pageID: {type: Schema.Types.ObjectId, ref: Article},
    time: {type: Number},
    created_at:  { type: String, default: Date.now },
},{ collection: 'analytics' });

const Analytics = mongoose.model('analytics', AnalyticsSchema);

module.exports= Analytics;