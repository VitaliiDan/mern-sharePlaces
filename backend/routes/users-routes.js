const express = require('express');
const {check} = require('express-validator');
const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middlware/file-upload');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({min: 6}),
	
	],
	usersControllers.signupUser);

router.post('/login', usersControllers.loginUser);

module.exports = router;