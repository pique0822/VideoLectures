firebase.auth().onAuthStateChanged(function(user) {
	setSignButtonText();
});
// Header

function goToResponses(){
	window.location.href = "responses.html";
}

function goToNewVideo(){
	window.location.href = "editor.html";
}

function goToLoadVideo(){
	document.getElementById('video_id').classList.remove('hidden');
}

function loadID(){
	ID = document.getElementById('ID').value;
	var patt = /^[a-z0-9]{5}$/i;
	if(patt.test(ID)){
		window.location.href = "client.html?id="+ID;
	}
}
