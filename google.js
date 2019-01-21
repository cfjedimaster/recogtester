const Vision = require('@google-cloud/vision');

function doProcess(path,auth) {

    const visionClient = new Vision.ImageAnnotatorClient({
        projectId:auth.project_id,
        credentials:auth
    });

    return new Promise((resolve, reject) => {
        
        console.log("Attempting Google recog");
        let promises = [];

        promises.push(new Promise((resolve, reject) => {
            visionClient.labelDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));

        promises.push(new Promise((resolve, reject) => {
            visionClient.faceDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.logoDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.cropHints(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.landmarkDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.textDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.imageProperties(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.safeSearchDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.webDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.objectLocalization(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            visionClient.documentTextDetection(path, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }));


        Promise.all(promises)
        .then(values => {
            let result = {
                labelP: values[0],
                faces: values[1],
                logo: values[2],
                crops: values[3],
                landmark: values[4],
                texts: values[5],
                properties: values[6],
                safe: values[7],
                web: values[8],
                loc_objects: values[9],
                docTxts: values[10]
            };
			console.log('resolving from google');
            return resolve({ google: result });
        })
        .catch(e => {
            console.log("in Google's catch");
            console.error(e);
            return reject(e);
        });
});
}

module.exports = { doProcess }

