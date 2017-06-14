let $, imageForm, imageField, imagePreview, statusDiv;
//hb related
let googleRenderer, googleResults, ibmRenderer, ibmResults;

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

	//temp
	//renderIBM();

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
}

function renderResults(data) {
	renderGoogle(data.google);
	renderIBM(data.ibm);
}

function renderGoogle(data) {
	googleResults.innerHTML = googleRenderer(data);
}

function renderIBM(data) {

	ibmResults.innerHTML = ibmRenderer(data);

}