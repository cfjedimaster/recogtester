/*
Generic notes:
helpful for file upload: https://forum.vuejs.org/t/vue-and-uploading-files/10982
*/

let myApp = new Vue({
	el:'#mainApp',
	data:{
		previewImage:'',
		status:'',
		file:null,
		google:null,
		ibm:null,
		ms:null,
		amazon:null
	},
	methods:{
		doPreview:function(e) {
			var that = this;
			if(!e.target.files || !e.target.files[0]) return;
			
			let reader = new FileReader();
			
			reader.onload = function (e) {
				that.previewImage = e.target.result;
			}
			
			reader.readAsDataURL(e.target.files[0]);
			this.file = e.target.files[0];
			this.google = null; this.ibm = null; this.ms = null; this.amazon = null;
			this.status = 'Upload image for results.';
		},
		doForm:function(e) {
			if(this.previewImage === '') return;
			console.log('Going to do form');
			this.status = '<i>Uploading and processing - stand by...</i>';

			let fd = new FormData();
			fd.append('testImage', this.file);
		
			fetch('/test', {
				method:'POST',
				body:fd
			}).then( 
				response => response.json()
			).then( (result) => {
				console.log('file result', result.result);
				this.status=''
				this.renderResults(result.result);
			}).catch( (e) => {
				console.error(e);
			});
		},
		renderResults:function(data) {
			if(data.google) this.google = data.google;
			if(data.ibm) this.ibm = data.ibm;
			if(data.ms) {
				let ct = data.ms.main.imageType.clipArtType;
				let ctType = 'Not Clipart';
				if(ct === 1) ctType = 'Ambiguous';
				if(ct === 2) ctType = 'Normal Clipart';
				if(ct === 3) ctType = 'Good Clipart'; 
				data.ms.main.imageType.ctType = ctType;
				this.ms = data.ms;
			}
			if(data.amazon) this.amazon = data.amazon;
		}
	}
});


