const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (e) {
        const error = new HttpError('Fetching users failed, please try again later', 500);
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
}

const signupUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const {name, email, password, image} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email})
    } catch (e) {
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead', 422);
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500)
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: createdUser.id,
                email: createdUser.email
            },
            'supersecret_dont_share',
            {expiresIn: '1h'});
    } catch (err) {
        console.log(err)
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({userId: createdUser.id, userEmail: createdUser.email, token })
}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email})
    } catch (e) {
        const error = new HttpError('Logging in failed, please try again later', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('Invalid credentials, could not log in.', 401);
        return next(error)
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials an try again.', 500)
        next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log in.', 401);
        return next(error)
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email
            },
            'supersecret_dont_share',
            {expiresIn: '1h'});
    } catch (err) {
        console.log(err);
        const error = new HttpError('Logging in failed, please try again later.', 500)
        return next(error);
    }

    res.status(200).json({userId: existingUser.id, userEmail: existingUser.email, token});
}

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;

