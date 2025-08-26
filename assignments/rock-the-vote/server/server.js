const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const { expressjwt } = require('express-jwt');

app.use(express.json());
app.use(morgan('dev'));

async function connectToDb() {
    try {
        await mongoose.connect(
            `mongodb+srv://marcopete:Mdabomb55@vschool.i9rhvwb.mongodb.net/`
        );
        console.log('connected to Db');
    } catch (error) {
        console.log(error);
    }
}
connectToDb();

app.use('/api/auth', require('./routes/authRouter'));
app.use(
    '/api/main',
    expressjwt({ secret: `process.env.SECRET`, algorithms: ['HS256'] })
); //any request that starts with this endpoint is going to require a token to be present
app.use('/api/main/issues', require('./routes/issueRouter'));

app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        res.status(err.status);
    }
    return res.send({ errMsg: err.message });
});

app.listen(8888, () => {
    console.log(`server is running on ${8888}`);
});
