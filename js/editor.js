video_input = document.getElementById('video_upload');
video_output = document.getElementById('video_player');
video_hour = document.getElementById('hour');
video_minute = document.getElementById('minute');
video_second = document.getElementById('second');
video_time = 0;
video_file = null;

question = document.getElementById('question');
timestamp_collection = document.getElementById('timestamp_collection');

load_screen = document.getElementById('loading_screen');
popup = document.getElementById('popup');
popup_text = document.getElementById('popup_text');

time2q = {};
all_timestamps = []

// Header

function goToResponses(){
	window.location.href = "responses.html";

}

function goToNewVideo(){
	console.log('Already in Editor');
}

function goToLoadVideo(){
	window.location.href = "index.html";
}

// Popup

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

var ui = new firebaseui.auth.AuthUI(firebase.auth());
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
// firebase.database().ref('responses/'

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    ui.start('#firebaseui-auth-container', uiConfig);
  } else {
    document.getElementById('loader').style.zIndex = 0;
    document.getElementById('loader').style.display = 'none';
    document.getElementById('firebaseui-auth-container').style.zIndex = 0;
    document.getElementById('firebaseui-auth-container').style.display = 'none';
  }});
// pass in the target node, as well as the observer options
observer.observe(document.getElementById('firebaseui-auth-container'), config);

ID_length=5
ID = ""
// Generate random 4 digit id
for(var d_id = 0; d_id < ID_length; d_id++)
{
	digit = Math.floor(Math.random() * 36);
	if(digit < 10)
	{
		ID+=digit;
	}else{
		digit = 65 + digit - 10;
		ID += String.fromCharCode(digit);
	}
}
if(!document.location.href.includes('?id=')){
	document.location.href+='?id='+ID;
} else {
	ID = extract_var('id');
}
popup_text.innerHTML = "Share this code to give others access to this video:<br /><b><font size='+3'>"+ID+"</font></b>";

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

	return value;
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




// STARTUP

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
		document.getElementById('loader').style.display = 'block';
		document.getElementById('firebaseui-auth-container').style.display = 'block';
		ui.start('#firebaseui-auth-container', uiConfig);
}});
// The start method will wait until the DOM is loaded.

video_input.onchange = function(event) {
  var file = video_input.files[0];
	video_file = file;

	var reader = new FileReader();

	reader.onload = function(e) {
		video_output.src = e.target.result;
	}

	reader.readAsDataURL(file);
	document.activeElement.blur();
}

video_output.ontimeupdate = function(event) {
	video_time = Math.floor(video_output.currentTime);
	seconds = video_time % 60;
	minute = Math.floor((video_time - seconds)/60)%60;
	hour = Math.floor((((video_time - seconds)/60) - minute)/60);

	video_second.value = seconds;
	video_minute.value = minute;
	video_hour.value = hour;
}

video_second.onchange = function(event) {
	duration = video_output.duration;
	if ((duration/60) >= 1){
		video_second.max = 59;
	} else{
		video_second.max = Math.floor(duration);
		video_minute.max = 0;
		video_hour.max = 0;
	}

	if ((duration/3600) >= 1){
		video_minute.max = 59;
		video_hour.max = Math.floot(duration/3600);
	} else {
		video_minute.max = Math.floor(duration/60);
		video_hour.max = 0;
	}

	h = parseInt(video_hour.value)*3600;
	m = parseInt(video_minute.value)*60;
	s = parseInt(video_second.value);

	video_time = h + m + s;

	video_output.currentTime = video_time;
}

video_minute.onchange = function(event) {
	duration = video_output.duration;
	if ((duration/60) >= 1){
		video_second.max = 59;
	} else{
		video_second.max = Math.floor(duration);
		video_minute.max = 0;
		video_hour.max = 0;
	}

	if ((duration/3600) >= 1){
		video_minute.max = 59;
		video_hour.max = Math.floot(duration/3600);
	} else {
		video_minute.max = Math.floor(duration/60);
		video_hour.max = 0;
	}

	h = parseInt(video_hour.value)*3600;
	m = parseInt(video_minute.value)*60;
	s = parseInt(video_second.value);

	video_time = h + m + s;

	video_output.currentTime = video_time;
}

video_hour.onchange = function(event) {
	duration = video_output.duration;
	if ((duration/60) >= 1){
		video_second.max = 59;
	} else{
		video_second.max = Math.floor(duration);
		video_minute.max = 0;
		video_hour.max = 0;
	}

	if ((duration/3600) >= 1){
		video_minute.max = 59;
		video_hour.max = Math.floot(duration/3600);
	} else {
		video_minute.max = Math.floor(duration/60);
		video_hour.max = 0;
	}

	h = parseInt(video_hour.value)*3600;
	m = parseInt(video_minute.value)*60;
	s = parseInt(video_second.value);

	video_time = h + m + s;

	video_output.currentTime = video_time;
}

function submitTimestamp(){
	if(video_output.src.length != 0 && question.value.length != 0)
	{
		video_time = Math.floor(video_output.currentTime);
		if(!(video_time in time2q))
		{
			all_timestamps.push(video_time);
		}
		time2q[video_time] = question.value;

		setup_timestamps();
	}
}

function seconds2time(sec_num){
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
	if(parseInt(hours) > 0)
	{
		return hours+':'+minutes+':'+seconds;
	}
	return minutes+':'+seconds;
}

function setup_timestamps(){
	all_timestamps.sort(function(a, b) {
  	return a - b;
	});

	data = "<br><br>"
	for(var i = 0; i < all_timestamps.length; i++)
	{
		this_time = all_timestamps[i];
		this_question = time2q[this_time];

		data += "<div class='timestamp_row' id="+this_time+" onmouseover='mouseOverTime(this)'><b>Q"+(i+1)+"</b>&nbsp;At time <b> "+seconds2time(this_time)+"</b> ask <b>"+this_question+"</b></div><br>"
	}

	timestamp_collection.innerHTML = data;
}

document.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {

		event.preventDefault();
		document.getElementById("submit_button").click();
		document.activeElement.blur();
	}
});

function mouseOverTime(elem)
{
	video_output.currentTime = elem.id;
}

function submitAll(){

	if(video_output.src.length != 0 && Object.keys(time2q).length != 0)
	{
		load_screen.classList.remove('hidden');
		document.body.style.overflow="hidden";

		UID = firebase.auth().currentUser.uid;
		firebase.database().ref('video_ids/' + ID).set({'timestamps':time2q, 'uid':firebase.auth().currentUser.uid});
		firebase.database().ref('user_ids/' + UID).set({'ID':ID, 'time':new Date().getTime()});
		firebase.storage().ref('video_ids/'+ID).put(video_file);
		setTimeout(function(){
			load_screen.classList.add('hidden');
			document.body.style.overflow="scroll";
			popup.classList.remove('hidden');
			popup.style.display = "block";
		}, 500);
	}
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == popup) {
		popup.style.display = "none";
	}
}
