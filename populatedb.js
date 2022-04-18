const async = require('async');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require("dotenv").config();

const User = require('./models/user');
const Message = require('./models/message');

const mongoDB = process.env.DB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

let users = [];
let messages = [];

function userCreate(first_name, last_name, username, password, cb) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        userDetail = {
            first_name: first_name,
            last_name: last_name,
            username: username,
            password: hashedPassword,
        };
        const user = new User(userDetail);
        user.save(function (err) {
            if (err) {
                cb(err, null);
                return;
            }
            console.log('New User: ' + user);
            users.push(user);
            cb(null, user);
        });
    })
}

function messageCreate(title, content, timestamp, user, cb) {
    messageDetail = {
        title: title,
        content: content,
        timestamp: timestamp,
        user: user,
    };
    const message = new Message(messageDetail);
    message.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Message: ' + message);
        messages.push(message);
        cb(null, message);
    });
}

function createUsers(cb) {
    async.parallel(
        [
            function (callback) {
                userCreate(
                    'William',
                    'Shakespeare',
                    'shakespeare@gmail.com',
                    'babyYoda1234',
                    callback
                );
            },
            function (callback) {
                userCreate(
                    'Artem',
                    'Kuryachiy',
                    'kuryachiy@gmail.com',
                    '1234YaFanatPisek',
                    callback
                );
            },
        ],
        cb
    );
}

function createMessages(cb) {
    async.parallel(
        [
            function (callback) {
                messageCreate(
                    'yes',
                    'I broke the law, what now?',
                    Date.now(),
                    users[0],
                    callback
                );
            },
            function (callback) {
                messageCreate(
                    'huh',
                    'why are you asking me? Im stoopid',
                    Date.now(),
                    users[1],
                    callback
                );
            },
            function (callback) {
                messageCreate(
                    'I thought thy were my friend',
                    'Title.',
                    Date.now(),
                    users[0],
                    callback
                );
            },
            function (callback) {
                messageCreate('yeah', ':)', Date.now(), users[1], callback);
            },
        ],
        cb
    );
}

async.series([
    createUsers,
    createMessages,
], function(err, results) {
    if (err) {
        console.log("Final error: " + err)
    } else {
        console.log("Done.")
    }
    mongoose.connection.close()
})