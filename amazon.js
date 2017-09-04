var request = require('request');
var fs = require('fs');
var AWS = require('aws-sdk');

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html
/*
detectFaces
detectLabels
detectModerationLabels
recognizeCelebrities

*/

function doProcess(path, auth) {

    var creds = new AWS.Credentials(auth.accessKeyId, auth.secretAccessKey);
    var myConfig = new AWS.Config({
        credentials: creds, region: auth.region
    });
    
    let recog = new AWS.Rekognition(myConfig);
    let params = {};
    
    let content = fs.readFileSync(path);
    params.Image = {Bytes: content};

    let faces = new Promise((resolve, reject) => {
        recog.detectFaces(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let labels = new Promise((resolve, reject) => {
        recog.detectLabels(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let modlabels = new Promise((resolve, reject) => {
        recog.detectModerationLabels(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let celebs = new Promise((resolve, reject) => {
        recog.recognizeCelebrities(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });


	return new Promise((resolve, reject) => {

		console.log('Attempting Amazon recog');
        Promise.all([faces, labels, modlabels, celebs]).then(values => {
            let faces = values[0];
            let labels = values[1];
            let modlabels = values[2];
            let celebs = values[3];
            let result = {
                faces:faces,
                labels:labels,
                modlabels:modlabels,
                celebs:celebs
            }
            resolve({"amazon":result});
        });
	});


}

module.exports = { doProcess }
