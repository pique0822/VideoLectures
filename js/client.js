video_player = document.getElementById('video');
question_text = document.getElementById('question');
response_text = document.getElementById('response');
submit_response = document.getElementById('submit_answer');
submit_to_db = document.getElementById('done');

load_screen = document.getElementById('loading_screen');

img_blobs = [];
video_timestamps = [];
video_time2q = {};
event_id = 0;
answering_question = false;
maximum_time = 0;

var imageCapture;
var mediaStream;
var constraints;

var number_of_updates = 0;

// Header
function goToResponses(){
	window.location.href = "responses.html";
}

function goToNewVideo(){
	window.location.href = "editor.html";
}

function goToLoadVideo(){
	window.location.href = "index.html";
}


navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(error => {
    console.log('enumerateDevices() error: ', error);
  })
  .then(getStream);

// From the list of media devices available, set up the camera source <select>,
// then get a video stream from the default camera source.
camera_source = null;
function gotDevices(deviceInfos) {
	console.log(deviceInfos);
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    console.log('Found media input or output device: ', deviceInfo);
    if (deviceInfo.kind === 'videoinput') {
      camera_source = deviceInfo.deviceId;
			break;
    }
  }
}

// Get a video stream from the currently selected camera source.
function getStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
    });
  }
  var videoSource = camera_source;
  constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(error => {
      console.log('getUserMedia error: ', error);
    });
}

// Display the stream from the currently selected camera source, and then
// create an ImageCapture object, using the video from the stream.
function gotStream(stream) {
  console.log('getUserMedia() got stream: ', stream);
  mediaStream = stream;
  imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
  getCapabilities();
}

// Get the PhotoCapabilities for the currently selected camera source.
function getCapabilities() {
  imageCapture.getPhotoCapabilities().then(function(capabilities) {
    console.log('Camera capabilities:', capabilities);
  }).catch(function(error) {
    console.log('getCapabilities() error: ', error);
  });
}

// Get an ImageBitmap from the currently selected camera source and
// display this with a canvas element.
function grabFrame() {
  imageCapture.grabFrame().then(function(imageBitmap) {
    console.log('Grabbed frame:', imageBitmap);
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
    canvas.classList.remove('hidden');
  }).catch(function(error) {
    console.log('grabFrame() error: ', error);
  });
}

function setZoom() {
  imageCapture.setOptions({
    zoom: zoomInput.value
  });
}

// Get a Blob from the currently selected camera source and
// display this with an img element.
function takePhoto() {
  imageCapture.takePhoto().then(function(blob) {
    img_blobs.push(blob);
  }).catch(function(error) {
    console.log('takePhoto() error: ', error);
  });
}









function removeInvalidSymbols(text){
	var copyText = text.replace('.','___period___');
	copyText = copyText.replace('#','___pound___');
	copyText = copyText.replace('$','___dollar___');
	copyText = copyText.replace('/','___fslash___');
	copyText = copyText.replace('[','___lbracket___');
	copyText = copyText.replace(']','___rbracket___');

	return copyText;
}

function addInvalidSymbols(text){
	var copyText = text.replace('___period___','.');
	copyText = copyText.replace('___pound___','#');
	copyText = copyText.replace('___dollar___','$');
	copyText = copyText.replace('___fslash___','/');
	copyText = copyText.replace('___lbracket___','[');
	copyText = copyText.replace('___rbracket___',']');

	return copyText;
}

// POPUP


var observer = new MutationObserver(function(mutations) {
  if(document.getElementById('firebaseui-auth-container').innerHTML.length == 0){
    document.getElementById('firebaseui-auth-container').style.zIndex = 0;
    document.getElementById('firebaseui-auth-container').style.display = 'none';
  }
});
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };
// pass in the target node, as well as the observer options
observer.observe(document.getElementById('firebaseui-auth-container'), config);


var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

// The start method will wait until the DOM is loaded.
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
		ui.start('#firebaseui-auth-container', uiConfig);
}
else{
	document.getElementById('firebaseui-auth-container').style.zIndex = 0;
	document.getElementById('firebaseui-auth-container').style.display = 'none';
	document.getElementById('loader').style.zIndex = 0;
	document.getElementById('loader').style.display = 'none';
}});

video_responses = [];
ID = extract_var('id');

firebase.database().ref('video_ids/' + ID).once('value').then(function(snapshot) {
	try{
		video_time2q = snapshot.val().timestamps;
		video_timestamps = Object.keys(video_time2q).sort(function(a, b) {
	  	return a - b;
		});

		maximum_time = video_timestamps[0];
		question_setup()
	}
	catch{
		console.log('FAILED');
	}
});

firebase.storage().ref().child('video_ids/'+ID).getDownloadURL().then(function(url) {
// `url` is the download URL for 'images/stars.jpg'

// This can be downloaded directly:
var xhr = new XMLHttpRequest();
xhr.responseType = 'blob';
xhr.onload = function(event) {
	var blob = xhr.response;
};
xhr.open('GET', url);
xhr.send();

console.log(url);
// Or inserted into an <img> element:

video.src=url;
}).catch(function(error) {
// Handle any errors
console.log(error);
}
);

function question_setup(){
	time = Math.floor(video.currentTime);
	console.log(time);
	console.log(video_timestamps[event_id]);
	if(time == video_timestamps[event_id]) {
		event_id += 1;
		video.pause();
		answering_question = true;

		this_question = video_time2q[time];

		question_text.classList.remove('hidden');
		question_text.innerHTML = this_question;

		response_text.classList.remove('hidden');

		submit_response.classList.remove('hidden');
	}
}

function submitResponse(){
	text = response_text.value;
	takePhoto();
	video_responses.push(removeInvalidSymbols(text));
	answering_question = false;

	maximum_time = video_timestamps[event_id];

	question_text.classList.add('hidden');
	question_text.innerHTML = "";

	response_text.classList.add('hidden');
	response_text.value = "";

	submit_response.classList.add('hidden');

	setTimeout(function(){ video.play(); }, 500);
}

video.ontimeupdate = function(event){
	if(answering_question && video.currentTime > maximum_time)
	{
		video.currentTime = maximum_time;
		video.pause();
	}
	else if (video.currentTime == video.duration) {
		document.getElementById('done_container').classList.remove('hidden');
	}
	else{
		question_setup();
	}
};

function extract_var(name){
	var url = window.location.href
	var first_q = url.indexOf('html?')

	var all_vars = url.substring(first_q+1, url.length)

	var useful_var = all_vars.indexOf(name)
	var next_var = all_vars.indexOf('?',useful_var)
	if (next_var == -1){
		next_var = all_vars.length
	}

	var value = all_vars.substring(useful_var + name.length+1,next_var)

	return value
}

function finishVideos(){
	loading_screen.classList.remove("hidden");
  replaced_email = removeInvalidSymbols(firebase.auth().currentUser.email);
	firebase.database().ref('response_ids/' + ID+'/'+replaced_email).set(
		{
			'responses':video_responses
		}
	);
	for(var pic_id = 0; pic_id < img_blobs.length; pic_id++)
	{
		firebase.storage().ref('response_ids/'+ID+'/'+replaced_email+'/response_'+pic_id).put(img_blobs[pic_id]);
	}
	setTimeout(function(){
		load_screen.classList.add('hidden');
		popup.classList.remove('hidden');
		popup.style.display = "block";
	}, img_blobs.length*300);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == popup || event.target == document.getElementById('popup_main_content')) {
		goToLoadVideo();
	}
}
