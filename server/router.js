const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) =>{
    app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);
    
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup',mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/account',mid.requiresLogin, controllers.Account.accountPage);
     app.get('/getPremium',mid.requiresLogin, controllers.Account.getPremium);
    app.post('/changePass',mid.requiresLogin, controllers.Account.passwordChange);
    app.post('/changePremium',mid.requiresLogin, controllers.Account.changePremium);

    app.get('/makeTweet',mid.requiresLogin, controllers.Tweet.makeTweetPage);
    app.post('/makeTweet',mid.requiresLogin, controllers.Tweet.makeTweet);

    app.post('/deleteTweet',mid.requiresLogin, controllers.Tweet.deleteTweet);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    app.get('/*wild', controllers.NotFound.notFound);

};

module.exports = router;