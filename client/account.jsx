const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState, useEffect } = React;

//Handle changing the password 
const handlePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!pass || !newPass || !newPass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { pass, newPass, newPass2 });

    return false;
}

// Get a form up for Password change 
const AccountWindow = (props) => {
    return (
        <form id="accountForm"
            name="accountForm"
            onSubmit={handlePassword}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor='pass'>Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor='newPass'> New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password" />
            <label htmlFor='newPass2'> New Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="confirm new password" />
            <input className="formSubmit" type="submit" value="Update Password" />
        </form>
    );
};

//Update the Premium by sending to POST.
const handlePremium = (e, onPremiumChange) => {
    e.preventDefault();
    helper.hideError();

    // used https://stackoverflow.com/questions/15839169/how-to-get-the-value-of-a-selected-radio-button
    const value = e.target.querySelector('input[name="premium"]:checked').value;

    helper.sendPost(e.target.action, { value }, onPremiumChange);

    return false;
}


//Get radio button for unlocking Premium, this should be a pop-up with a paywall but for sake 
// Of demostration, it's this.
const PremiumWindow = (props) => {

    const [checked, setChecked] = useState(true);

    const switchChecked = (e) => {
        setChecked(e.target.checked);
    }

    // The radio buttons were based on the React Radio code from https://www.w3schools.com/react/react_forms_radio.asp
    return (
        <form id="premiumForm"
            name="premiumForm"
            onSubmit={(e) => {handlePremium(e, props.triggerReload)}}
            action="/changePremium"
            method="POST"
            className="mainForm"
        >
            <h2>Premium!</h2>
            <p>Pay $1 a month to unlock new features for your birds</p>
            <label>
                <input
                    type="radio"
                    name="premium"
                    value="false"
                    id="false"
                    onChange={switchChecked}
                    checked = {checked}
                /> No
            </label>
            <label>
                <input
                    type="radio"
                    name="premium"
                    value="true"
                    id="true"
                    onChange={switchChecked}
                    checked = {checked}
                /> Yes
            </label>
            <input className="formSubmit" type="submit" value="Sign up for Premium!" id="submit"/>
        </form>
    );

}

//Display premium!
const GotPremium = (props) => {
     const [premium, setPremium] = useState(props.premium);

    useEffect(() => {
        const loadPremium = async () => {
            const response = await fetch('/getPremium');
            const data = await response.json();
            setPremium(data.premium);
        }
        loadPremium();
    }, [props.reloadPage]);

    return (
        <div>
            <h2>Your Premium is: {premium}</h2>
        </div>
    )
}

//Set up an app for our react components
const App = () => {
     const [reloadPage, setReloadPage] = useState(false);

    return (
        <div>
            <div>
                <GotPremium reloadPage={reloadPage} triggerReload={() => setReloadPage(!reloadPage)}/>
                <PremiumWindow  triggerReload={() => setReloadPage(!reloadPage)}/>
            </div>
            <div>
                <AccountWindow />
            </div>
        </div>
    );
}


//Init to display everything to screen
const init = () => {
    const root = createRoot(document.getElementById('account'));
    
    root.render(<App />);
};

window.onload = init;