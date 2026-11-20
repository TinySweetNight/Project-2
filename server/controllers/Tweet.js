const models = require('../models');
const Tweet = models.Tweet;

const makeTweetPage = async (req, res) => {
    return res.render('app');
}

const makeTweet = async (req, res) => {
    if (!req.body.species || !req.body.location || !req.body.message) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }

    const tweetData = {
        species: req.body.species,
        location: req.body.location,
        message: req.body.message,
        owner: req.session.account._id,
    };

    try {
        const newTweet = new Tweet(tweetData);
        await newTweet.save();
        return res.status(201).json({species: newTweet.species, location: newTweet.location, message: newTweet.message});
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'tweet already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making tweet!' });
    }
};

const getTweets = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Tweet.find(query).select('species location message').lean().exec();

        return res.json({ tweets: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving tweets!' });
    }
};


const deleteTweet = async (req, res) => {
    try{
        await Tweet.deleteOne({_id: req.body.id, owner:req.session.account._id}).exec();
        
        return res.status(200).json({message: 'Tweet deleted'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error deleting Tweet'});
    }
}

module.exports = {
    makeTweetPage,
    makeTweet,
    getTweets,
    deleteTweet
};