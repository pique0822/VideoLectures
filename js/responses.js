firebase.auth().onAuthStateChanged(function(user) {
	setSignButtonText();
	if (user){
		console.log('Signed In');
		document.getElementById('firebaseui-auth-container').style.zIndex = 0;
    document.getElementById('firebaseui-auth-container').style.display = 'none';
    document.getElementById('loader').style.zIndex = 0;
    document.getElementById('loader').style.display = 'none';
		firebase.database().ref('user_ids/' +user.uid).once('value').then(function(snapshot) {
				console.log(snapshot);
				ID = snapshot.val().ID;
				UID = ID;
        content_id.innerHTML = '<h1>'+ID+'</h1>'
				time = snapshot.val().time;
				d = new Date();
				if(d.getTime() - time >= 7*24*3600*1000){
					throw ID + " is too old.";
				}

        extract_responses(ID);
			});
	} else{
		signUser();
	}
});

content_responses = document.getElementById('all_responses');
content_id = document.getElementById('video_ID');

UID = null;
number_of_questions = 0;
emails = [];

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

// Header

function goToResponses(){
	console.log('Already in Repsonses');
}

function goToNewVideo(){
	window.location.href = "editor.html";
}

function goToLoadVideo(){
	window.location.href = "index.html";
}

// STARTUP

function extract_responses(code){
	emails = [];
	var all_responses = [];
  firebase.database().ref('response_ids/' +code).once('value').then(function(snapshot) {
    responses = Object.keys(snapshot.val());
    for(var rid = 0; rid < responses.length; rid++)
    {
      var email = responses[rid];
      var ans = snapshot.val()[email]['responses'];
      var total = ans.length;
			number_of_questions = total;
      var complete = 0;

			// Extracting Text
      var innerText = "";
      for(var aid = 0; aid < total; aid++)
      {
        if(ans[aid].trim().length > 0)
        {
          complete++;
        }
        innerText += "<div class='question_response'><div class='question_number'>"+(aid+1)+"</div><div class='img_container'><img id='A"+rid+"_"+aid+"_img' class='student_img' alt='Student Image' /></div><div class='student_text'>"+addInvalidSymbols(ans[aid])+"</div></div><hr>";
      }
      innerText = "<div class='answers hidden' id='A"+rid+"_parent'><h3>Answers</h3><div id='A"+rid+"_content'><hr>" + innerText + "</div></div>";
      outerText = "<div class='response' id='Q"+rid+"' onclick='toggleVisibility("+rid+")'><div class='response_name'><h2>"+addInvalidSymbols(email)+"</h2></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class='response_complete'><h2>Complete: "+complete+'/'+total+"</h2></div></div>";

      all_responses.push(outerText + innerText + "<br>");

			emails.push(email);
    }

		content_responses.innerHTML = all_responses;

  });
}

function setupImages(email, pic_id, qid) {
	// Extracting Images
		firebase.storage().ref().child('response_ids/'+UID + '/'+email+'/response_'+qid).getDownloadURL().then(function(url) {
					// This can be downloaded directly:
					var xhr = new XMLHttpRequest();
					xhr.responseType = 'blob';
					xhr.onload = function(event) {
						var blob = xhr.response;
					};
					xhr.open('GET', url);
					xhr.send();
					console.log(url);
					console.log('A'+pic_id+'_'+qid+'_img');
					document.getElementById('A'+pic_id+'_'+qid+'_img').src = url;
					}).catch(function(error) {
						// Handle any errors
						console.log(error);
					});
}

function toggleVisibility(id)
{
	console.log(emails[id]);
  var elem = document.getElementById('A'+id+'_parent');
  if(elem.classList.contains('hidden'))
  {
    elem.classList.remove('hidden');
		for(var qid = 0; qid < number_of_questions; qid++)
		{
			setupImages(emails[id], id, qid);
		}
  } else {
    elem.classList.add('hidden');
  }
}
