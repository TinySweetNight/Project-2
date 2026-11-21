const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};


const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

// Account Page to place our password change inside of
const accountPage = (req, res) => {
    return res.render('account');
}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All Fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }
        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/makeTweet' });
    })

};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are requires!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash, isPremium: false});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/makeTweet' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error Occured!' });
    }

};

//Change the password of the logged in account.
const passwordChange = async (req, res) => {
    const pass = `${req.body.pass}`;
    const newPass = `${req.body.newPass}`;
    const newPass2 = `${req.body.newPass2}`;

    if (!pass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(newPass);

        const user = await Account.findById(req.session.account._id);
        //Update Password to the database and log the account out

        user.password = hash;

        await user.save();
        
       return res.json({ redirect: '/logout' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error Occured!' });
    }

}

//Make update to Premium 
const changePremium = async (req, res) => {
    const value = `${req.body.value}`;

    try{
        const user = await Account.findById(req.session.account._id);

        user.isPremium = value;

        await user.save();

        return res.status(200).json({message: 'Updated!'});
    } catch (err){
        console.log(err);
        return res.status(500).json({ error: 'An Error Occured!'});
    }
}

//get Premium
const getPremium = async (req, res) => {
     try {
        const user = await Account.findById(req.session.account._id);
        let doc = user.isPremium;

        doc = JSON.stringify(doc);

        return res.json({premium: doc});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving premium!' });
    }
}

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    accountPage,
    passwordChange,
    changePremium,
    getPremium,
};