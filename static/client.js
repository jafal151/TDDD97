var passLength = 3;

displayView = function(view){
// the code required to display a view
document.getElementById("body").innerHTML = view.innerHTML;
};

window.onload = function(){
	welcomeView = document.getElementById("welcomeView");
	profileView = document.getElementById("profileView");
  var Token = localStorage.getItem("Token");
  if (localStorage.getItem("Token") != null) {
      console.log("onload Token: ",Token);
      //document.getElementById("body").innerHTML = profileView.innerHTML;
      displayView(profileView);
      document.getElementById("defaultOpen").click();
      
      loadProfileView();
    }

  else{
      // Kollo om det finns token, i så fall skicka profileview
  	displayView(welcomeView);
    console.log("onloading : test1 ");
  }
};


function validatePassword(password, repeatedPassword, error){
  if(password !== repeatedPassword){
      error.innerHTML = "Passwords don't match!"
      return false;
  }
  if(password.length < passLength){
      error.innerHTML = "Password too short"
      return false;
  }
  return true;
}

function signIn(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange= function() { 
    if (this.readyState == 4 && this.status==200) {
      var resp = JSON.parse(xhr.responseText);
      if (resp.success) {
          Token=resp.data;
          console.log(resp.success)
          localStorage.setItem("Token", resp.data);
          console.log("signIn Token:", Token)
          displayView(profileView);
          document.getElementById("defaultOpen").click();

          xhr.open("POST", "/sign_in", true);
          xhr.send(JSON.stringify({'email' : email ,
                            'password' : password}))
          loadProfileView();
      }
    
    else{
      var errorArea = document.getElementById("signInError");
      errorArea.innerHTML= resp.message;
      }
    } 
  }
}

function loadProfileView(){
	 var returnCode = serverstub.getUserDataByToken(localStorage.Token);

    if(returnCode.success){
      var user = returnCode.data;
      //add the user's data to user label
      document.getElementById("userInfo").innerHTML = "Name: " + user.firstname + " "+ user.familyname + " <br>" 
      + "Gender: " +user.gender + "<br>"
      + "City: " + user.city + "<br>"
      + "Country: " + user.country + "<br>"
      + "Email: " + user.email + "<br>";
      localStorage.setItem("userEmail" , user.email)
    }
}

function signUp(form){
  var errorArea = document.getElementById("signUpError");
  
  var value = validatePassword(form.password.value, form.repeatPassword.value, errorArea);


  if(value) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var resp = JSON.parse(xhr.responseText);
        if(resp.success){
              errorArea.innerHTML  = "signed up";
        }
        else{
          errorArea.innerHTML = resp.message;
        }
      }
    }
    xhr.open("POST", "/sign_up", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    //xhr.setRequestHeader('token','localstoragetinghy');
    
    xhr.send(JSON.stringify({'email': form.email.value,
            'password': form.password.value,
            'fname': form.firstname.value,
            'familyname': form.familyname.value,
            'gender': form.gender.value,
            'city': form.city.value,
            'country': form.country.value,}))
  }
  else{
    errorArea.innerHTML = value.message;
  }
}


function signOut(){
  returnCode = serverstub.signOut(localStorage.Token);
  if(returnCode.success == true){
    localStorage.removeItem("Token");
    displayView(welcomeView);
  }
  else{
    localStorage.removeItem("Token");
    displayView(welcomeView);
    console.log("SignoutError: ", returnCode.message);
  }
}

function changePassword(){
  var oldPass = document.getElementById("oldPass").value;
  var newPass = document.getElementById("newPass").value;
  var repeatNewPass = document.getElementById("repeatNewPass").value;
  var errorArea = document.getElementById("changePassError");

  if(validatePassword(newPass, repeatNewPass, errorArea)){
    var returnCode = serverstub.changePassword(Token, oldPass, newPass);
  }
  errorArea.innerHTML = returnCode.message;
}

function postMessage(toEmail){
  var errorArea = null;
  var input = null;
  var userEmail = localStorage.getItem("userEmail")
  if(toEmail == null){
    toEmail = userEmail;
    errorArea = document.getElementById("postMessageError");
    input = document.getElementById("browsePostBox").value;
  }else{
    errorArea = document.getElementById("browsePostMessageError");
    input = document.getElementById("browsePostBox").value
  }
  var returnCode = serverstub.postMessage(Token, input, toEmail);
  errorArea.innerHTML = returnCode.message;
  toEmail = null;
  console.log("posted message: ",input);
}

function searchUser(){
  email = document.getElementById("searchField").value;
  var returnCode = serverstub.getUserDataByEmail(localStorage.Token, email);
  var errorArea = document.getElementById("searchUserError");
  console.log(email);

  if(returnCode.success){
    searchedUser = email;
    var user = returnCode.data;
   document.getElementById("searchId").innerHTML = "Name: " + user.firstname + " "+ user.familyname + " <br>" 
      + "Gender: " +user.gender + "<br>"
      + "City: " + user.city + "<br>"
      + "Country: " + user.country + "<br>"
      + "Email: " + user.email + "<br>";
    loadBrowseMessages();
  }
  errorArea.innerHTML = returnCode.message;
}

function loadHomeMessages(){
  console.log("Token", Token)
  var returnCode = serverstub.getUserMessagesByToken(Token);
  document.getElementById("homeMessageWall").innerHTML= null;

  if(returnCode.success){
    var messages = returnCode.data;
    document.getElementById("")
    for (i = 0; i < messages.length; i++) {
      document.getElementById("homeMessageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
      document.getElementById("homeMessageWall").innerHTML += messages[i].content + "<br></p>";
    }
  }
}

function postUserMessage(){
  toEmail= document.getElementById("searchField").value;
  console.log("toEmal: ", toEmail);
  var errorArea = null;
  var input = null;
  if(toEmail == null){
    toEmail = userEmail;
    console.log(toEmail);
    errorArea = document.getElementById("postMessageError");
    input = document.getElementById("browsePostBox").value;
  }else{
    errorArea = document.getElementById("browsePostMessageError");
    input = document.getElementById("browsePostBox2").value
  }
  var returnCode = serverstub.postMessage(localStorage.Token, input, toEmail);
  errorArea.innerHTML = returnCode.message;
  toEmail = null;
  console.log("posted message: ",input);
}

function loadBrowseMessages(){
  var returnCode = serverstub.getUserMessagesByEmail(localStorage.Token,searchedUser);
  if (returnCode.success){
      var messages= returnCode.data;
      document.getElementById("browseMessageWall").innerHTML= null;
      for (i = 0; i < messages.length; i++) {
      document.getElementById("browseMessageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
      document.getElementById("browseMessageWall").innerHTML += messages[i].content + "<br></p>";
    }
  }
}

function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
