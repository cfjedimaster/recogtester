const VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
const fs = require("fs");

function doProcess(path, auth) {
	return new Promise((resolve, reject) => {

		console.log("Attempting IBM recog");
		let visual_recognition = new VisualRecognitionV3({
			iam_apikey: auth.api_key,
			version: '2018-03-19'
		});

		/*
		11/1/2018
		For some reason, both API calls using the same stream caused some kind of
		weird lock, sync issue. My workaround is to just use to streams, but it 
		feels weird.		
		*/
		let params = {
			images_file: fs.createReadStream(path)
		};

		let params2 = {
			images_file: fs.createReadStream(path)
		};

		let mainP = new Promise((resolve, reject) => {
			visual_recognition.classify(params, function(err, res) {
				if (err) reject(err);
				else resolve(res);
			});
		});

		let faceP = new Promise((resolve, reject) => {
			visual_recognition.detectFaces(params2, function(err, res) {
				if (err) reject(err);
				else resolve(res);
			});
		});

		Promise.all([mainP, faceP])
		.then(values => {
			let result = {
				main: values[0].images[0],
				faces: values[1].images[0]
			};
			return resolve({ ibm: result });
		})
		.catch(e => {
			console.log("in IBMs catch");
			console.error(e);
			return reject(e);
		});
  });

}

module.exports = { doProcess };
