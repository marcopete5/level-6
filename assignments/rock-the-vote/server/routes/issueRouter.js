const express = require('express');
const Issue = require('../models/issue');
const issueRouter = express.Router();

//post
issueRouter.post('/', async (req, res, next) => {
    try {
        req.body.userId = req.auth._id; //id of the logged in user
        const newIssue = new Issue(req.body);
        const savedIssue = await newIssue.save();
        return res.status(201).send(savedIssue);
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

//get
issueRouter.get('/', async (req, res, next) => {
    try {
        console.log('hit here');
        const foundIssues = await Issue.find();
        return res.status(200).send(foundIssues);
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

//get
issueRouter.get('/:userId', async (req, res, next) => {
    try {
        const foundIssues = await Issue.find({ userId: req.auth._id });
        return res.status(200).send(foundIssues);
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

module.exports = issueRouter;
