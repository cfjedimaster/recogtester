var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

function doProcess(path, auth) {

	return new Promise((resolve, reject) => {

		console.log('Attempting IBM recog');
		var visual_recognition = new VisualRecognitionV3({
			api_key: auth.api_key,
			version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
		});
		
		var params = {
			images_file: fs.createReadStream(path)
		};

		let mainP = new Promise((resolve, reject) => {

			visual_recognition.classify(params, function(err, res) {
			if (err)
				reject(err);
			else
				resolve(res);
			});

		});

		let faceP = new Promise((resolve, reject) => {
			visual_recognition.detectFaces(params, function(err, res) {
			if (err)
				reject(err);
			else
				resolve(res);
			});
		});

		Promise.all([mainP, faceP]).then(values => {
			let result = {
				main:values[0].images[0],
				faces:values[1].images[0]
			};
			resolve(result);
		});

	});

};

module.exports = { doProcess }

