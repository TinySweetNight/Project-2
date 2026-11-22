const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//Have to make Premium or else color will get mad at me.
const handleTweetPremium = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const species = e.target.querySelector('#tweetSpecies').value;
    const message = e.target.querySelector('#tweetNote').value;
    const location = e.target.querySelector('#tweetLocation').value;
    const color = e.target.querySelector('#tweetColor').value;


    if (!species || !location || !message || !color) {
        helper.handleError('Species, Location, and Message are required');
        return false;
    }

    helper.sendPost(e.target.action, { location, species, message, color }, onTweetAdded);
    return false;
}

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const species = e.target.querySelector('#tweetSpecies').value;
    const message = e.target.querySelector('#tweetNote').value;
    const location = e.target.querySelector('#tweetLocation').value;


    if (!species || !location || !message) {
        helper.handleError('Species, Location, and Message are required');
        return false;
    }

    helper.sendPost(e.target.action, { location, species, message }, onTweetAdded);
    return false;
}


const deleteTweet = async (id, onTweetDeleted) => {
    await fetch('/deleteTweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });

    onTweetDeleted();
}

//Modified this to include getting premium so we can hide color
//Color is a premium feature
//Might swap it out for images later down the line.
const TweetForm = (props) => {
    const [premium, setPremium] = useState(props.isPremium);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets');
            const data = await response.json();
            setPremium(data.isPremium);
        }
        loadTweetsFromServer();
    }, [props.reloadTweets]);

    if (premium) {
        return (
            <form id="tweetForm"
                onSubmit={(e) => handleTweetPremium(e, props.triggerReload)}
                name="tweetForm"
                action="/makeTweet"
                method="POST"
                className="tweetForm"
            >
                <label htmlFor="species">Species:</label>
                <input id="tweetSpecies" type="text" name="species" placeholder="Species" />
                <label htmlFor="location">Location:</label>
                <input id="tweetLocation" type="text" name="location" placeholder="Spotted Location" />
                <label htmlFor="message">Message:</label>
                <input id="tweetNote" type="text" name="message" placeholder="Notes" />
                <label htmlFor="color">Color:</label>
                <input id="tweetColor" type="text" name="color" placeholder="Color" />
                <br />
                <input className="makeTweetSubmit" type="submit" value="Make Tweet" />
            </form>
        )
    } else {
           return (
            <form id="tweetForm"
                onSubmit={(e) => handleTweet(e, props.triggerReload)}
                name="tweetForm"
                action="/makeTweet"
                method="POST"
                className="tweetForm"
            >
                <label htmlFor="species">Species:</label>
                <input id="tweetSpecies" type="text" name="species" placeholder="Species" />
                <label htmlFor="location">Location:</label>
                <input id="tweetLocation" type="text" name="location" placeholder="Spotted Location" />
                <label htmlFor="message">Message:</label>
                <input id="tweetNote" type="text" name="message" placeholder="Notes" />
                <br />
                <input className="makeTweetSubmit" type="submit" value="Make Tweet" />
            </form>
        )

    }


}


const TweetList = (props) => {
    const [tweets, setTweets] = useState(props.tweets);
    const [premium, setPremium] = useState(props.isPremium);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets');
            const data = await response.json();
            setTweets(data.tweets);
            setPremium(data.isPremium);
        }
        loadTweetsFromServer();
    }, [props.reloadTweets]);

    if (tweets.length === 0) {
        return (
            <div className="tweetsList">
                <h3 className="emptyTweets">No Tweets Yet!</h3>
            </div>
        );
    }



    // Have a check encase if the owner is premium, it'll decide to show the hidden information or not
    const tweetNodes = tweets.map(tweet => {

        if (premium) {
            return (
                <div key={tweet.id} className="tweet">
                    <h2 className="tweetSpecies">{tweet.species}</h2>
                    <h3 className="tweetLocation">Location: {tweet.location}</h3>
                    {tweet.color &&
                        <h3 className="tweetColor">Color: {tweet.color}</h3>
                    }
                    <p className="tweetNote">{tweet.message}</p>
                    <button onClick={() => deleteTweet(tweet._id, props.triggerReload)}>Delete</button>
                </div>
            );
        } else {
            return (
                <div key={tweet.id} className="tweet">
                    <h2 className="tweetSpecies">{tweet.species}</h2>
                    <h3 className="tweetLocation">Location: {tweet.location}</h3>
                    <p className="tweetNote">{tweet.message}</p>
                    <button onClick={() => deleteTweet(tweet._id, props.triggerReload)}>Delete</button>
                </div>
            );
        }
    });

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    )

}

const App = () => {
    const [reloadTweets, setReloadTweets] = useState(false);

    return (
        <div>
            <div id="makeTweet">
                <TweetForm triggerReload={() => setReloadTweets(!reloadTweets)} />
            </div>
            <div>

            </div>
            <div id="tweets">
                <TweetList tweets={[]} reloadTweets={reloadTweets} triggerReload={() => setReloadTweets(!reloadTweets)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;