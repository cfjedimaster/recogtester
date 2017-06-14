var request = require('request');
var fs = require('fs');

function doProcess(path, auth) {

	let mainUrl = auth.url;

	let headers = {
		'Content-Type':'application/json',
		'Ocp-Apim-Subscription-Key':auth.key
	}

	return new Promise((resolve, reject) => {

		console.log('Attempting Microsoft recog');

		let formData = {
			theFile:fs.createReadStream(path)
		}

		let mainP = new Promise((resolve, reject) => {

			let theUrl = mainUrl + 
			'/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&details=Celebrities,Landmarks&language=en';

			request.post({url:theUrl, headers:headers, formData:formData}, function(err, response, body) {
				if(err) {
					reject(err);
				} else {
					resolve(JSON.parse(body));
				}
			});

		});

		let ocrP = new Promise((resolve, reject) => {

			let theUrl = mainUrl + '/ocr?language=unk';

			request.post({url:theUrl, headers:headers, formData:formData}, function(err, response, body) {
				if(err) {
					reject(err);
				} else {
					resolve(JSON.parse(body));
				}
			});

		});

		Promise.all([mainP, ocrP]).then(values => {
			let result = {
				main:values[0],
				ocr:values[1]
			};
			resolve(result);
		});

	});


}

module.exports = { doProcess }
