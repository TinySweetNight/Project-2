const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const species = e.target.querySelector('#tweetSpecies').value;
    const message = e.target.querySelector('#tweetMessage').value;
    const location = e.target.querySelector('#tweetLocation').value;

    if(!species || !location || !message) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {location, species, message}, onTweetAdded);
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
                <input id="tweetSpecies" type="text" name="species" placeholder="Species"/>
                <label htmlFor="location">Location:</label>
                <input id="tweetLocation" type="text" name="location" placeholder= "Spotted Location"/>
                <label htmlFor="message">Message:</label>
                <input id="tweetMessage" type="text" name="message" placeholder= "Notes"/>
                <br />
                <input className="makeTweetSubmit" type="submit" value="Make Tweet"/>
            </form>
    )

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

    if(tweets.length === 0) {
        return (
            <div className="tweetsList">
                <h3 className="emptyTweets">No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = tweets.map(tweet => {
        return (
            <div key={tweet.id} className="tweet">
                {/* Owner Picture or a placeHolder?
                    <img src="/assets/img/tweetface.jpeg" alt="tweet face" className="tweetFace" />*/}
                <h2 className="tweetSpecies">{tweet.species}</h2>
                <h3 className= "tweetLocation">Location: {tweet.location}</h3>
                <p className= "tweetMessage">{tweet.message}</p>
                 <button onClick={() => deleteTweet(tweet._id, props.triggerReload)}>Delete</button> 
            </div>
        );
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
                <TweetForm triggerReload={()=> setReloadTweets(!reloadTweets)}/>
            </div>
            <div id="tweets">
                <TweetList tweets={[]} reloadTweets={reloadTweets} triggerReload={() => setReloadTweets(!reloadTweets)}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
}

window.onload = init;