const { default: axios } = require("axios");


// Description: Handles all the user related logic
function getGoogleAuthURL() {
	const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
	const options = {
		redirect_uri: 'http://localhost:3000/auth/google/callback',
		client_id: process.env.CLIENT_ID,
		response_type: 'code',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		].join(' '),

	};
	return `${rootUrl}?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&response_type=${options.response_type}&scope=${options.scope}`;

}

// Description: Get Tokens

async function getTokens({ code, client_id, client_secret, redirect_uri }) {

	const url = 'https://oauth2.googleapis.com/token';
	const values = {
		code,
		client_id,
		client_secret,
		redirect_uri,
		grant_type: 'authorization_code',
	};

	return axios.post(url, values, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then(res => res.data).catch(error => { throw new Error(error.message) });
}

// Load Auth Page
const loadAuth = (req, res) => {
    res.render('auth');
}

// Success Google Login
const successGoogleLogin = (req, res) => {
    const user = req.query;
    res.send("Welcome " + user.name);
}



module.exports = {
    loadAuth,
    successGoogleLogin,
    getGoogleAuthURL,
    getTokens
}