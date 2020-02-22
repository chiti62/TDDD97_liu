var userToken = null;
var searchUserEmail = '';
var validateToken = false;

window.onload = function () {
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    //window.alert() is not allowed to be used in your implementation.
    // window.alert("Hello TDDD97!");
    displayView();
};

displayView = function () {
    if (userToken == null) {
        var wv = document.getElementById("welcomeView");
        document.getElementById("container").innerHTML = wv.text;
    } else {
        var mp = document.getElementById("profileView");
        document.getElementById("container").innerHTML = mp.text;

        document.getElementById('Home').style.display = "block";
        getUserProfile();
        openTab(null, "Home");
        // postReload();
    }
};

validatePassword = function (name) {
    // console.log("abc");
    if (name == 'signup') {
        var alertplace = document.getElementById("pwconfirmmsg");
        var password = document.getElementById("signuppassword");
        var confirm_password = document.getElementById("confirmpassword");
    } else {
        var alertplace = document.getElementById("changepwresult");
        var password = document.getElementById("newpassword");
        var confirm_password = document.getElementById("confirmnewpassword");
    }
    if (password.value.length < 4) {
        alertplace.innerHTML = "Password too short (at least 4 characters)";
        validateToken = false;
    } else {
        if (password.value != confirm_password.value) {
            alertplace.innerHTML = "Passwords Don't Match";
            validateToken = false;
        } else {
            alertplace.innerHTML = "";
            validateToken = true;
        }
    }

}

signUp = function () {
    if (!validateToken) {
        return;
    }
    var firstName = document.getElementById("FirstName").value;
    var familyName = document.getElementById("FamilyName").value;
    var gender = document.getElementById("Gender").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var email = document.getElementById("signupemail").value;
    var password = document.getElementById("signuppassword").value;
    var newUser = {
        "email": email,
        "password": password,
        "firstname": firstName,
        "familyname": familyName,
        "gender": gender,
        "city": city,
        "country": country
    }
    var response = serverstub.signUp(newUser);
    console.log(response);
    if (response.success) {
        var loginresponse = serverstub.signIn(email, password);
        userToken = loginresponse.data;
        console.log(userToken);
        //signin
        //profile view
        displayView();
        getUserProfile();
        validateToken = false;
    } else {
        //error msg display
        document.getElementById("pwconfirmmsg").innerHTML = response.message;
        console.log(response.message);
    }


}

logIn = function () {
    var email = document.getElementById("loginemail").value;
    var password = document.getElementById("loginpassword").value;

    var response = serverstub.signIn(email, password);
    console.log(response);
    if (response.success) {
        userToken = response.data;
        //view user data
        displayView();
        getUserProfile();
    } else {
        //error display
        document.getElementById("pwconfirmmsg").innerHTML = response.message;
    }
}

getUserProfile = function () {
    // console.log(userToken);
    var userData = serverstub.getUserDataByToken(userToken).data;
    var email = userData.email;
    var firstname = userData.firstname;
    var familyname = userData.familyname;
    var gender = userData.gender;
    var city = userData.city;
    var country = userData.country;
    var userProfile = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";
    console.log(userProfile);
    document.getElementById("userprofile").innerHTML = userProfile;
}

openTab = function (evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    // console.log(evt.currentTarget.className);
}

changePassword = function () {
    if (!validateToken) {
        return;
    }
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;
    var response = serverstub.changePassword(userToken, oldPassword, newPassword);
    var alertplace = document.getElementById("changepwresult");
    console.log(response.message);
    alertplace.innerHTML = response.message;
    if (response.success) {
        // console.log(response.message);
        validateToken = false;
    }
    // else {

    // }
    // if (response.success) {
    //     form.reset();
    // }
}


signOut = function () {
    var response = serverstub.signOut(userToken);
    userToken = null;
    //change to welcome page
    displayView();
}

writePost = function (toEmail) {
    var userData = serverstub.getUserDataByToken(userToken).data;

    // var toEmail = document.getElementById("searchuser").value;
    // console.log(searchUserEmail);
    if (toEmail == 'own') {
        var post = document.getElementById("postInput").value;
        var message = serverstub.postMessage(userToken, post, userData.email);
    } else {
        var post = document.getElementById("postInput2").value;
        var message = serverstub.postMessage(userToken, post, searchUserEmail);
    }
    console.log(message);

}

reloadPost = function (ofEmail) {
    if (ofEmail == 'own') {
        var response = serverstub.getUserMessagesByToken(userToken);
        var wall = document.getElementById("posts");
    } else {
        var response = serverstub.getUserMessagesByEmail(userToken, searchUserEmail);
        var wall = document.getElementById("posts2");
    }
    // console.log(searchUserEmail);
    if (response.success) {
        var msgs = response.data;
        var msgUser = ""
        for (i = 0; i < msgs.length; i++) {
            msgUser = msgUser + "User " + msgs[i].writer + ": " + msgs[i].content + "<br>"
        }
        wall.innerHTML = msgUser;
    } else {
        console.log(response);
    }
}

searchUser = function () {
    var email = document.getElementById("searchuser").value;
    var response = serverstub.getUserDataByEmail(userToken, email);
    if (response.success) {
        var userData = response.data;
        var firstname = userData.firstname;
        var familyname = userData.familyname;
        var gender = userData.gender;
        var city = userData.city;
        var country = userData.country;
        var data = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";
    } else {
        var data = sendBackMessage.message;
    }
    document.getElementById("searchresult").innerHTML = data;
    searchUserEmail = email;
}