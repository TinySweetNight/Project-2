const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if ( !pass || !newPass|| !newPass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, newPass, newPass2 });

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


const init = () => {
    const root = createRoot(document.getElementById('account'));
    
    root.render(<AccountWindow/>);
};

window.onload = init;