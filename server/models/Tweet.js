const mongoose = require('mongoose');
const _ = require('underscore');

const setSpecies = (species) => _.escape(species).trim();

const setLocation = (location) => _.escape(location).trim();

const setMessage = (message) => _.escape(message).trim();

const setColor = (color) => _.escape(color).trim();

const TweetSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
        set: setMessage,
    },
     species: {
        type: String,
        required: true,
        trim: true,
        set: setSpecies,
    },
    location: {
        type: String,
        required: true,
        trim: true,
        set: setLocation,
    },
    color: {
        type: String,
        trim: true,
        set: setColor,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

TweetSchema.statics.toAPI = (doc) => ({
    message: doc.message,
    species: doc.species,
    location: doc.location,
    color: doc.color,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;