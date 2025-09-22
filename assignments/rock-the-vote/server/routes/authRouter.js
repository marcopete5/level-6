const express = require('express');
const authRouter = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// Signup
authRouter.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() })
        .then((user) => {
            if (user) {
                res.status(403);
                return next(new Error('Username already taken'));
            }
            const newUser = new User(req.body);
            return newUser.save();
        })
        .then((savedUser) => {
            const token = jwt.sign(
                savedUser.withoutPassword(),
                process.env.SECRET
            );
            return res
                .status(201)
                .send({ token, user: savedUser.withoutPassword() });
        })
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Login
authRouter.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() })
        .then((user) => {
            if (!user) {
                res.status(403);
                return next(new Error('Username or password incorrect'));
            }
            user.checkPassword(req.body.password, (err, isMatch) => {
                if (err) {
                    res.status(500);
                    return next(err);
                }
                if (!isMatch) {
                    res.status(403);
                    return next(new Error('Username or password incorrect'));
                }
                const token = jwt.sign(
                    user.withoutPassword(),
                    process.env.SECRET
                );
                return res
                    .status(200)
                    .send({ token, user: user.withoutPassword() });
            });
        })
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

module.exports = authRouter;
