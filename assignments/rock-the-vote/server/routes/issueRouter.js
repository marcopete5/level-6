const express = require('express');
const issueRouter = express.Router();
const Issue = require('../models/issue.js');

// Get All Issues
issueRouter.get('/', (req, res, next) => {
    Issue.find()
        .then((issues) => res.status(200).send(issues))
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

// Delete Issue
issueRouter.delete('/:issueId', (req, res, next) => {
    Issue.findOneAndDelete({ _id: req.params.issueId, user: req.auth._id })
        .then((deletedIssue) => {
            if (!deletedIssue) {
                res.status(404);
                return next(
                    new Error('Issue not found or user not authorized')
                );
            }
            return res
                .status(200)
                .send(`Successfully deleted issue: ${deletedIssue.title}`);
        })
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

// Update Issue
issueRouter.put('/:issueId', (req, res, next) => {
    Issue.findOneAndUpdate(
        { _id: req.params.issueId, user: req.auth._id },
        req.body,
        { new: true }
    )
        .then((updatedIssue) => {
            if (!updatedIssue) {
                res.status(404);
                return next(
                    new Error('Issue not found or user not authorized')
                );
            }
            return res.status(200).send(updatedIssue);
        })
        .catch((err) => {
            res.status(500);
            return next(err);
        });
});

module.exports = issueRouter;
