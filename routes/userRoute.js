const express = require('express');
const router = express();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');


// Load Auth Page

router.get('/', userController.loadAuth);

// Auth 
router.get('/auth/google/url', (req, res) => {
	const googleAuthUrl = userController.getGoogleAuthURL();
	res.redirect(googleAuthUrl);
});

// Auth Callback 
router.get('/auth/google/callback', async (req, res) => {

	const code = req.query.code;

	const { id_token, access_token } = await userController.getTokens({
		code,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: 'http://localhost:3000/auth/google/callback'
	});

	// Fetch User Profile with Access Token and bearer token

	const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
		headers: {
			Authorization: `Bearer ${id_token}`
		}

	}).then(res => res.data)
		.catch(error => {

			throw new Error(error.message)


		});


	const token = jwt.sign({ googleUser }, process.env.JWT_SECRET);

	res.cookie('token', token, { httpOnly: true });
	res.redirect('/auth/user');
});


// Success Google Login

router.get('/auth/user', (req, res) => {
	try {
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET);
		if (user) {
			const googleUser = user.googleUser;
			res.redirect(`/success?name=${googleUser.name}`)

		}
	} catch (error) {
		res.send("Unauthorized");

	}
})
router.get('/success', userController.successGoogleLogin);



module.exports = router;