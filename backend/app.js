const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error')

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {
    const path = './errors-log.txt';
    const date = new Date;
    const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} -`;
    const e = error.toString();
    if (fs.existsSync(path)) {
        fs.appendFile('./errors-log.txt', `\n${dateString} : ${e}`, (err) => {
            if (err) throw err;
        })
    } else {
        fs.writeFile('errors-log.txt', `\n${dateString} : ${e}`, (err) => {
            if (err) throw err;
        })
    }

    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err)
        });
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
})

mongoose
    .connect('mongodb+srv://admin:tmbI3zkCDN9dRBSa@cluster0.cc9nq.mongodb.net/udemyMern?retryWrites=true&w=majority')
    .then(() => {
        app.listen(8000);
    })
    .catch(error => {
        console.log('Cant connect to DB.')
    });