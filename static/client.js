var passLength = 3;

displayView = function(view){
// the code required to display a view
document.getElementById("body").innerHTML = view.innerHTML;
};

window.onload = function(){
welcomeView = document.getElementById("welcomeView");
profileView = document.getElementById("profileView");
  var Token = localStorage.getItem("token");
  if (localStorage.getItem("token") != null) {
      console.log("onload token: ",Token);
      displayView(profileView);
      document.getElementById("defaultOpen").click();     
      loadProfileView();
    }

  else{
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

function signIn(form){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange= function() {
    if (this.readyState == 4 && this.status==200) {
      var resp = JSON.parse(xhr.responseText);
      if (resp.success) {
          token=resp.data;
          localStorage.setItem("token", resp.data);
          console.log("signIn token:", token)
          displayView(profileView);
          document.getElementById("defaultOpen").click();
          loadProfileView();
      }
   
    else{
      var errorArea = document.getElementById("signInError");
      errorArea.innerHTML= resp.message;
      }
    }
  }
  xhr.open("POST", "/sign_in", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({'email' : form.login_email.value ,'password' : form.login_password.value}));
}


  function loadProfileView(){
    var token = localStorage.getItem("token");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200) {
        var resp = JSON.parse(xhr.responseText);
        if(resp.success) {
            document.getElementById("userInfo").innerHTML = "Name: " + resp.fname+ " "+ resp.familyname + " <br>"
            + "Gender: " +resp.gender + "<br>"
            + "City: " + resp.city + "<br>"
            + "Country: " + resp.country + "<br>"
            + "Email: " + resp.email + "<br>";
            localStorage.setItem("userEmail" , resp.email)
        }
        else {
          console.log("user info not found :(")        }
      }
    }
      xhr.open("GET", "/userdata_token", true);
      xhr.setRequestHeader('token', token);
      xhr.send();
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
  var token = localStorage.getItem("token");
  var xhr = new XMLHttpRequest();


 // returnCode = serverstub.signOut(localStorage.token);
 xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var resp = JSON.parse(xhr.responseText);
        if(resp.success){
          displayView(welcomeView);
          localStorage.removeItem("token");
        }
        else {
          console.log("wrong")
        }
      }
    }
    xhr.open("POST", "/sign_out", true);
    xhr.setRequestHeader('token', token);
    xhr.send();
    }

function changePassword(){
  var oldPass = document.getElementById("oldPass").value;
  var newPass = document.getElementById("newPass").value;
  var token = localStorage.getItem("token")
  var repeatNewPass = document.getElementById("repeatNewPass").value;
  var errorArea = document.getElementById("changePassError");

  if(validatePassword(newPass, repeatNewPass, errorArea)){
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          if(resp.success) {
            errorArea.innerHTML="password changed :D"
           }
          }
         else  {         
          errorArea.innerHTML = "could not change Password :(";
           }
      }
    }
  xhr.open("POST", "/change_password", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader('token', token);

  xhr.send(JSON.stringify({'oldPassword' : oldPass ,'newPassword' : newPass}));


}


function postMessage(toEmail){
  var errorArea = null;
  var input = null;
  var userEmail = localStorage.getItem("userEmail")
  var token = localStorage.getItem("token");
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
     var resp = JSON.parse(xhr.responseText);
        if(resp.success) {
          document.getElementById("postMessageError").innerHTML = resp.message;
          }
        }
        else {
          document.getElementById("postMessageError").innerHTML = "postmessage error";
        }
  }
    input = document.getElementById("browsePostBox").value

    xhr.open("POST", "/post_message", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.setRequestHeader('token', token);
    xhr.send(JSON.stringify({'email' : userEmail, 'message' : input})); 
}


function searchUser(){
  var token = localStorage.getItem("token");
  var xhr = new XMLHttpRequest();

  email = document.getElementById("searchField").value;

  xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200) {
        var resp = JSON.parse(xhr.responseText);
        if(resp.success) {
          document.getElementById("searchId").innerHTML = "Name: " + resp.fname + " "+ resp.familyname + " <br>"
          + "Gender: " +resp.gender + "<br>"
          + "City: " + resp.city + "<br>"
         + "Country: " + resp.country + "<br>"
         + "Email: " + resp.email + "<br>";
        }
        else {
          document.getElementById("homeError").innerHTML = resp.message;
        }
      }
    }
      xhr.open("GET", "/userdata_email" + document.getElementById("searchField") , true);
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

      xhr.setRequestHeader('token', token);
      xhr.send();
}


function loadHomeMessages(){
  token= localStorage.getItem("token")
  console.log("token:= ", token)
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
        var resp = JSON.parse(xhr.responseText);

        if(resp.success) {
          var text = "";
          var size = resp.data.length;
            if(resp.data.length < 15){

               for(var i = size - 1; 0 <= i; i--){
                  text += resp.writers[i] + ": " + resp.data[i] + "<br>";
                }
               }
            else {
                for(var i = size - 1 ; size - 15 <= i; i--){
                  text += resp.writers[i] + ": " + resp.data[i] + "<br>";
                  console.log(text)
              }
            
            }
              document.getElementById("homeMessageWall").innerHTML=text;
          }
          else{
            console.log("Homemessage failure :(")
       }
      } 
    }
  xhr.open("GET", "/messages_token", true);
  xhr.setRequestHeader('token', token);
  xhr.send();
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
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

