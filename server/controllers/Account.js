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
        const newAccount = new Account({ username, password: hash });
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
    const newPass = `${req.body.passNew}`;
    const newPass2 = `${req.body.passNew2}`;

    if (!pass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(newPass);
        //Need user log in
       // const query = { owner: req.session.account._id };

        const user = await Account.findById(req.session.account._id);
        //Update Password to the database and log the account out

        user.password = hash;

        console.log(user.password);
        console.log(hash);

        await user.save();
        
       return res.json({ redirect: '/logout' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error Occured!' });
    }


}

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    accountPage,
    passwordChange,
};