const User = require('../models/user');
const Message = require('../models/message');

const { body, validationResult } = require('express-validator');
const async = require('async');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.index = function (req, res, next) {
    async.parallel(
        {
            authors: function (callback) {
                User.find({}).exec(callback);
            },
            messages: function (callback) {
                Message.find().populate('user').exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            res.render('index', {
                title: 'The Board',
                user: req.user,
                messages: results.messages.reverse(),
            });
        }
    );
};

exports.signup_get = function (req, res) {
    res.render('sign_up', {
        title: 'Board Sign Up',
        user: false,
        errors: false,
    });
};

exports.signup_post = [
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified.')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),
    body('username').trim().isLength({ min: 1 }).isEmail().escape(),
    body('password').trim().isLength({ min: 1 }).escape(),
    body('passwordConf')
        .custom((value, { req }) => value === req.body.password)
        .withMessage(
            'Password Confirmation field must match your Password field'
        ),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log('hey');
        if (!errors.isEmpty()) {
            console.log('errors');
            console.log(errors.array());
            const user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
            };
            console.log(user);
            res.render('sign_up', {
                title: 'Board Sign Up',
                user: user,
                errors: errors.array(),
            });
            return;
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                let user = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: hashedPassword,
                    membership: false,
                    admin: false,
                }).save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            });
        }
    },
];

exports.secret_get = function (req, res) {
    res.send('secret_get');
};

exports.secret_post = function (req, res) {
    res.send('secret_post');
};

exports.message_post = [
    body('title').exists().trim().escape(),
    body('content').exists().trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('message', {
                message: req.body,
                errors: errors.toArray(),
            });
            return;
        } else {
            let message = new Message({
                title: req.body.title,
                content: req.body.content,
                timestamp: Date.now(),
                user: req.user,
            }).save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    },
];
