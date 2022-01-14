const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error')

const app = express();

app.use(bodyParser.json());

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
		fs.appendFile('./errors-log.txt', `\n${dateString} : ${e}`, (err)=> {
			if (err) throw err;
			console.log('Saved!');
		})
	} else {
		fs.writeFile('errors-log.txt', `\n${dateString} : ${e}`, (err)=> {
			if (err) throw err;
			console.log('Saved!');
		})
	}
	
	if (res.headerSent) {
		return next(error)
	}
	res.status(error.code || 500);
	res.json({message: error.message || 'An unknown error occurred!'});
})

app.listen(5000);