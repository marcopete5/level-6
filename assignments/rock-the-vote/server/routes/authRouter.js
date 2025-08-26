const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

authRouter.post('/signup', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            res.status(403);
            return next(new Error('username is already taken'));
        }
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign(savedUser.toObject(), `process.env.SECRET`);
        return res.status(201).send({ user: savedUser, token });
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

authRouter.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(403);
            return next(new Error('incorrect username or password'));
        }
        if (req.body.password !== user.password) {
            res.status(403);
            return next(new Error('incorrect username or password'));
        }
        const token = jwt.sign(user.toObject(), `process.env.SECRET`);
        return res.status(201).send({ user, token });
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

module.exports = authRouter;
