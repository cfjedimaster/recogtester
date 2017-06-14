let $, imageForm, imageField, imagePreview, statusDiv;
//hb related
let googleRenderer, googleResults;

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
	//temp
	//renderGoogle();

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
}

function renderResults(data) {
	renderGoogle(data.google);
}

function renderGoogle(data) {

//	let fakeData = {"result":{"google":{"crops":[[{"x":0,"y":0},{"x":1548,"y":0},{"x":1548,"y":1935},{"x":0,"y":1935}]],"document":"A\n","faces":[{"angles":{"pan":15.55792236328125,"roll":-2.4011716842651367,"tilt":-4.510236740112305},"bounds":{"head":[{"x":250,"y":119},{"x":1260,"y":119},{"x":1260,"y":1293},{"x":250,"y":1293}],"face":[{"x":445,"y":474},{"x":1170,"y":474},{"x":1170,"y":1200},{"x":445,"y":1200}]},"features":{"confidence":33.51017236709595,"chin":{"center":{"x":851.24365234375,"y":1189.420166015625,"z":64.9207534790039},"left":{"x":468.36175537109375,"y":1016.9117431640625,"z":226.0179443359375},"right":{"x":1073.311767578125,"y":978.289794921875,"z":394.2215270996094}},"ears":{"left":{"x":393.9350280761719,"y":814.85693359375,"z":321.55828857421875},"right":{"x":1063.2548828125,"y":772.1948852539062,"z":507.3419189453125}},"eyebrows":{"left":{"left":{"x":568.4329833984375,"y":609.8734130859375,"z":-7.700161457061768},"right":{"x":766.7412719726562,"y":603.2803344726562,"z":-43.909542083740234},"top":{"x":670.3038330078125,"y":570.7503662109375,"z":-48.502830505371094}},"right":{"left":{"x":909.8065795898438,"y":594.1348876953125,"z":-4.097055912017822},"right":{"x":1060.4862060546875,"y":578.5689086914062,"z":129.072265625},"top":{"x":990.0723266601562,"y":550.4470825195312,"z":40.39353942871094}}},"eyes":{"left":{"bottom":{"x":684.3853759765625,"y":699.5982666015625,"z":-2.2061991691589355},"center":{"x":687.1436767578125,"y":674.67041015625,"z":0.002807424170896411},"left":{"x":611.9142456054688,"y":680.5706787109375,"z":9.182403564453125},"pupil":{"x":675.0734252929688,"y":678.470458984375,"z":-10.057442665100098},"right":{"x":737.2415161132812,"y":676.8114013671875,"z":16.17209243774414},"top":{"x":682.5931396484375,"y":657.89697265625,"z":-23.092910766601562}},"right":{"bottom":{"x":970.2862548828125,"y":680.7758178710938,"z":79.06178283691406},"center":{"x":968.2936401367188,"y":659.1541748046875,"z":79.2823257446289},"left":{"x":913.0068359375,"y":665.103759765625,"z":65.12149047851562},"pupil":{"x":977.5558471679688,"y":659.3140869140625,"z":73.6674575805664},"right":{"x":1023.2479858398438,"y":654.38623046875,"z":123.54061126708984},"top":{"x":977.0536499023438,"y":639.1417846679688,"z":58.845458984375}}},"forehead":{"x":841.0896606445312,"y":595.738037109375,"z":-35.38434600830078},"lips":{"bottom":{"x":857.2548217773438,"y":1056.269775390625,"z":12.416036605834961},"top":{"x":857.9052124023438,"y":948.9092407226562,"z":-17.91969871520996}},"mouth":{"center":{"x":855.2510375976562,"y":1001.2710571289062,"z":8.467660903930664},"left":{"x":717.488525390625,"y":990.1656494140625,"z":33.567283630371094},"right":{"x":959.4313354492188,"y":977.3016357421875,"z":99.1842041015625}},"nose":{"bottom":{"center":{"x":857.2472534179688,"y":891.7044677734375,"z":-23.790807723999023},"left":{"x":765.3052978515625,"y":864.394287109375,"z":-3.109846830368042},"right":{"x":919.674072265625,"y":859.7985229492188,"z":40.87684631347656}},"tip":{"x":871.8900146484375,"y":844.489501953125,"z":-95.49024200439453},"top":{"x":840.8673095703125,"y":658.474609375,"z":-23.53343963623047}}},"confidence":97.19247221946716,"joy":true,"joyLikelihood":4,"sorrow":false,"sorrowLikelihood":0,"anger":false,"angerLikelihood":0,"surprise":false,"surpriseLikelihood":0,"underExposed":false,"underExposedLikelihood":0,"blurred":false,"blurredLikelihood":0,"headwear":false,"headwearLikelihood":0}],"landmarks":[],"labels":["hair","facial hair","person","beard","glasses"],"logos":[],"properties":{"colors":["d1cace","392e2f","6d4e4d","a79c9d","b89898","221919","807475","937070","dcd6da","605252"]},"safeSearch":{"adult":false,"spoof":false,"medical":false,"violence":false},"similar":["https://pbs.twimg.com/media/DAb-qlwWAAAzhzj.jpg","https://www.intothebox.org/__media/speakers/ray3_2017.jpg","http://www.cfobjective.com/2017/cache/file/DEC7DB2E-2AFA-4DC8-A9753A0DDD3FD16F_speakerimage.jpg","https://cdn-images-1.medium.com/max/512/1*BJXS12Fk9Nw2r014IvKajQ.jpeg","https://pbs.twimg.com/profile_images/842026934426980353/8qEuCdi-.jpg","https://pbs.twimg.com/media/DAb-qlwWAAAzhzj.jpg","https://www.intothebox.org/__media/speakers/ray3_2017.jpg"],"text":[]}}};
//	data = fakeData.result.google;
	console.log(data);
	googleResults.innerHTML = googleRenderer(data);
}