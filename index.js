const express = require('express');
const app = express();
const chalk = require('chalk');
const formidable = require('formidable');
const path = require('path');
const creds = require('./creds.json');

const google = require('./google');
const ibm = require('./ibm');
const microsoft = require('./microsoft');

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

		let gProm = google.doProcess(theFile, creds.google);
		let iProm = ibm.doProcess(theFile, creds.ibm);
		let mProm = microsoft.doProcess(theFile, creds.microsoft);

		Promise.all([gProm, iProm, mProm]).then((results) => {
			res.send({result:{
				'google':results[0],
				'ibm':results[1],
				'ms':results[2]
			}});
		}).catch((err) => {
			console.log('Failures', err);	
		});



	});

});

app.listen(3000, () => {
	console.log(chalk.green('Listening on port 3000'));
});

/*
(results) => {
			console.log(chalk.green('Success from Google'));
			res.send({result:{
					'google':results
				}
			});*/