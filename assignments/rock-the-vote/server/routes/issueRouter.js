const express = require('express');
const issueRouter = express.Router();
const Issue = require('../models/issue.js');

// Get All Issues (Sorted by Votes)
issueRouter.get('/', (req, res, next) => {
    Issue.find()
        .populate('user', 'username')
        .then((issues) => {
            // Sort issues by net votes (upvotes - downvotes)
            const sortedIssues = issues.sort(
                (a, b) =>
                    b.upvotedBy.length -
                    b.downvotedBy.length -
                    (a.upvotedBy.length - a.downvotedBy.length)
            );
            return res.status(200).send(sortedIssues);
        })
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Get issues by user
issueRouter.get('/user', (req, res, next) => {
    Issue.find({ user: req.auth._id })
        .then((issues) => res.status(200).send(issues))
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Add new Issue
issueRouter.post('/', (req, res, next) => {
    req.body.user = req.auth._id;
    const newIssue = new Issue(req.body);
    newIssue
        .save()
        .then((savedIssue) => res.status(201).send(savedIssue))
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Upvote an Issue
issueRouter.put('/upvote/:issueId', (req, res, next) => {
    Issue.findOneAndUpdate(
        { _id: req.params.issueId },
        {
            $addToSet: { upvotedBy: req.auth._id },
            $pull: { downvotedBy: req.auth._id }
        },
        { new: true }
    )
        .then((updatedIssue) => res.status(200).send(updatedIssue))
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Downvote an Issue
issueRouter.put('/downvote/:issueId', (req, res, next) => {
    Issue.findOneAndUpdate(
        { _id: req.params.issueId },
        {
            $addToSet: { downvotedBy: req.auth._id },
            $pull: { upvotedBy: req.auth._id }
        },
        { new: true }
    )
        .then((updatedIssue) => res.status(200).send(updatedIssue))
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

module.exports = issueRouter;
