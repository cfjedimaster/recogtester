const Vision = require('@google-cloud/vision');


function doProcess(path,auth) {

	const visionClient = Vision({
		projectId:auth.project_id,
		credentials:auth
	});

	return new Promise((resolve, reject) => {

		console.log('Attempting Google Image recog');
		visionClient.detect(path, {
			types:['crops', 'document', 'faces', 'landmarks',
				'labels', 'logos', 'properties', 'safeSearch', 
				'similar', 'text']
		})
		.then((results) => {
			resolve(results[0]);
		})
		.catch((err) => {
			console.error('ERROR:', err);
			reject(err);
		});
	
});

}

module.exports = { doProcess }
