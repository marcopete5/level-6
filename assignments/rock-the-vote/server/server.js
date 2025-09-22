const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { expressjwt } = require('express-jwt');

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// DB Connect
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// Routes
app.use('/auth', require('./routes/authRouter'));
// Protect API routes
app.use(
    '/api',
    expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })
);
app.use('/api/issues', require('./routes/issueRouter'));

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        res.status(err.status);
    }
    return res.send({ errMsg: err.message });
});

// Server Listen
app.listen(9000, () => {
    console.log(`Server is running on port 9000`);
});
