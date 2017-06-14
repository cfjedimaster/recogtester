const express = require('express');
const app = express();
const chalk = require('chalk');
const formidable = require('formidable');
const path = require('path');
const creds = require('./creds.json');

const google = require('./google');

app.use(express.static('public'));

app.post('/test', (req, res) => {
	console.log(chalk.green('About to Test!'));
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if(!files.testImage) {
			res.send({result:0});
			return;
		}
		let theFile = files.testImage.path;

		/*
		now we go through N services
		*/

		google.doProcess(theFile, creds.google).then((results) => {
			console.log(chalk.green('Success from Google'));
			res.send({result:{
					'google':results
				}
			});

		})
		.catch((err) => {
			console.log(chalk.red('Error from Google:'+err));
		});


	});

});

app.listen(3000, () => {
	console.log(chalk.green('Listening on port 3000'));
});