let $, imageForm, imageField, imagePreview, statusDiv;
//hb related
let googleRenderer, googleResults, ibmRenderer, ibmResults, msRenderer, msResults;

window.addEventListener('DOMContentLoaded', () => {
	//alias jquery like a hipster
	$ = document.querySelector.bind(document);
	imageForm = $('#imageForm');
	imageField = $('#testImage');
	imagePreview = $('#previewImage');
	statusDiv = $('#status');

	imageForm.addEventListener('submit', doForm, false);
	imageField.addEventListener('change', doPreview, false);

	googleResults = $('#googleResults');
	googleRenderer = Handlebars.compile($('#google-template').innerHTML);

	ibmResults = $('#ibmResults');
	ibmRenderer = Handlebars.compile($('#ibm-template').innerHTML);

	msResults = $('#msResults');
	msRenderer = Handlebars.compile($('#ms-template').innerHTML);

}, false);

function doPreview() {
	if(!imageField.files || !imageField.files[0]) return;

	var reader = new FileReader();

	reader.onload = function (e) {
		imagePreview.src = e.target.result;
	}

	reader.readAsDataURL(imageField.files[0]);
	//todo - clear results. as soon as you pick a new image, even if you don't submit
	clearResults();
	statusDiv.innerHTML = 'Upload image for results.';
}

function doForm(e) {
	e.preventDefault();
	let currentImg = imageField.value;
	if(currentImg === '') return;
	console.log('Going to process '+currentImg);

	statusDiv.innerHTML = '<i>Uploading and processing - stand by...</i>';

	let fd = new FormData();
	fd.append('testImage', imageField.files[0]);

	fetch('/test', {
		method:'POST',
		body:fd
	}).then( 
		response => response.json()
	).then( (result) => {
		console.log('file result', result.result);
		statusDiv.innerHTML = '';
		renderResults(result.result);
	}).catch( (e) => {
		console.error(e);
	});
}

function clearResults() {
	googleResults.innerHTML = '';
	ibmResults.innerHTML = '';
	msResults.innerHTML = '';
}

function renderResults(data) {
	renderGoogle(data.google);
	renderIBM(data.ibm);
	renderMS(data.ms);
}

function renderGoogle(data) {
	googleResults.innerHTML = googleRenderer(data);
}

function renderIBM(data) {

	ibmResults.innerHTML = ibmRenderer(data);

}

function renderMS(data) {
//	data=	{"main":{"categories":[{"name":"text_mag","score":0.99609375}],"adult":{"isAdultContent":false,"isRacyContent":false,"adultScore":0.15891394019126892,"racyScore":0.1494748741388321},"tags":[{"name":"cat","confidence":0.9999942779541016},{"name":"indoor","confidence":0.9885744452476501},{"name":"laying","confidence":0.9711009860038757},{"name":"orange","confidence":0.5914885401725769},{"name":"mammal","confidence":0.5026237964630127,"hint":"animal"},{"name":"domestic cat","confidence":0.32638099789619446}],"description":{"tags":["cat","indoor","laying","top","orange","lying","black","bed","sitting","front","sleeping","white","gray","brown","sign","closed","eyes"],"captions":[{"text":"a cat lying on a bed","confidence":0.8218265670305823}]},"requestId":"4af653a1-0bc4-4079-9f55-d8f11225bacf","metadata":{"width":625,"height":468,"format":"Jpeg"},"faces":[],"color":{"dominantColorForeground":"White","dominantColorBackground":"White","dominantColors":["White","Black"],"accentColor":"1C3A62","isBWImg":false},"imageType":{"clipArtType":0,"lineDrawingType":0}},"ocr":{"language":"en","textAngle":0,"orientation":"Down","regions":[{"boundingBox":"19,20,606,447","lines":[{"boundingBox":"19,20,606,64","words":[{"boundingBox":"19,20,119,64","text":"nol"},{"boundingBox":"242,21,291,63","text":"03wwsw"},{"boundingBox":"549,20,76,64","text":"sv"}]},{"boundingBox":"110,366,403,101","words":[{"boundingBox":"110,366,403,101","text":"awagwws"}]}]}]}};
	console.log(data);

	/*
	Since handlebars is so anti-logic-in template...
	Non-clipart = 0,
ambiguous = 1,
normal-clipart = 2,
good-clipart = 3.
	*/
	let ct = data.main.imageType.clipArtType;
	let ctType = 'Not Clipart';
	if(ct === 1) ctType = 'Ambiguous';
	if(ct === 2) ctType = 'Normal Clipart';
	if(ct === 3) ctType = 'Good Clipart'; 
	data.main.imageType.ctType = ctType;
	msResults.innerHTML = msRenderer(data);
}