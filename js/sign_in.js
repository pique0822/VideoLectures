
// var observer = new MutationObserver(function(mutations) {
//   if(document.getElementById('firebaseui-auth-container').innerHTML.length == 0){
//     document.getElementById('firebaseui-auth-container').style.zIndex = 0;
//     document.getElementById('firebaseui-auth-container').style.display = 'none';
//   }
// });
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

function signUser(){
	user = firebase.auth().currentUser;
	  if (user) {
			document.getElementById('loader').style.zIndex = 0;
			document.getElementById('loader').style.display = 'none';
			document.getElementById('firebaseui-auth-container').style.zIndex = 0;
			document.getElementById('firebaseui-auth-container').style.display = 'none';

			firebase.auth().signOut();

			document.getElementById('sign_in').innerText = 'Sign In';
	  } else {
			document.getElementById('loader').style.display = 'block';
			document.getElementById('firebaseui-auth-container').style.display = 'block';
			ui.start('#firebaseui-auth-container', uiConfig);

			document.getElementById('sign_in').innerText = 'Sign Out';
		}
}

function setSignButtonText(){
	user = firebase.auth().currentUser;
	if(user){
		document.getElementById('sign_in').innerText = 'Sign Out';
	} else {
		document.getElementById('sign_in').innerText = 'Sign In';
	}
}


// pass in the target node, as well as the observer options
observer.observe(document.getElementById('firebaseui-auth-container'), config);
