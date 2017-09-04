let $, imageForm, imageField, imagePreview, statusDiv;
//hb related
let googleRenderer, googleResults, ibmRenderer, ibmResults, msRenderer, msResults, amazonRenderer, amazonResults;

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

	amazonResults = $('#amazonResults');
	amazonRenderer = Handlebars.compile($('#amazon-template').innerHTML);

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
	//https://stackoverflow.com/a/6243000/52160
	googleResults.style.display = 'none';
	ibmResults.style.display = 'none';
	msResults.style.display = 'none';
	amazonResults.style.display = 'none';
	googleResults.innerHTML = '';
	ibmResults.innerHTML = '';
	msResults.innerHTML = '';
	amazonResults.innerHTML = '';

}

function renderResults(data) {
	if(data.google) {
		googleResults.style.display = 'block';
		renderGoogle(data.google);
	}
	if(data.ibm) {
	ibmResults.style.display = 'block';
		renderIBM(data.ibm);
	}
	if(data.ms) {
		msResults.style.display = 'block';
		renderMS(data.ms);
	}
	if(data.amazon) {
	amazonResults.style.display = 'block';
		renderAmazon(data.amazon);
	}
}

function renderGoogle(data) {
	googleResults.innerHTML = googleRenderer(data);
}

function renderIBM(data) {

	ibmResults.innerHTML = ibmRenderer(data);

}

function renderMS(data) {
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

function renderAmazon(data) {
	console.log(data.modlabels);
	console.log(data.celebs);
	amazonResults.innerHTML = amazonRenderer(data);

}
