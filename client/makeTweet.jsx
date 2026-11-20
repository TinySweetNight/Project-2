const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const species = e.target.querySelector('#tweetSpecies').value;
    const message = e.target.querySelector('#tweetNote').value;
    const location = e.target.querySelector('#tweetLocation').value;

    if (!species || !location || !message) {
        helper.handleError('All fields are required');
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

const TweetForm = (props) => {
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

const FilterForm = (props) => {
    return (
        <form id = "tweetForm"
        onSubmit={(e) => handleFilter(e, props.triggerReload)}
        name="filterForm"
        className="tweetFrom"
        >
            <label htmlFor="search">Search By Species:</label>
            <input id="search" type="text" name="search" placeholder="Species" />
             <input className="makeTweetSubmit" type="submit" value="Filter Tweets" />
        </form>
    )
}

const handleFilter = (e) => {
    const species = e.target.querySelector('#search').value;

    if (!species) {
        helper.handleError('All fields are required');
        return false;
    }

    return (species);
}


const TweetList = (props) => {
    const [tweets, setTweets] = useState(props.tweets);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets');
            const data = await response.json();
            setTweets(data.tweets);
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


   // if(!species === "" || !species === null)
  //  {
  //      setTweets = tweets.filter(tweet => tweet.species === species);
  //  }

    const  tweetNodes = tweets.map(tweet => {
        return (
            <div key={tweet.id} className="tweet">
                <h2 className="tweetSpecies">{tweet.species}</h2>
                <h3 className="tweetLocation">Location: {tweet.location}</h3>
                <p className="tweetNote">{tweet.message}</p>
                <button onClick={() => deleteTweet(tweet._id, props.triggerReload)}>Delete</button>
            </div>
        );
     });
  

    // This needs to be changed to add a filter for recent or oldest bird sighting
    return (
        <div className="tweetList">
            <FilterForm/>
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