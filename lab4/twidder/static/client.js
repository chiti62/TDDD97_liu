// const API_URL = 'http://localhost:5000';
// const API_URL = 'https://tddd97-chiti602.herokuapp.com';

var userToken = null;
var searchUserEmail = '';
var validateToken = false;//password validate

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
    // var response = serverstub.signUp(newUser);
    // console.log(response);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response.message);
                logIn2(email, password);
            } else {
                document.getElementById("pwconfirmmsg").innerHTML = response.message;
            }
        } else {
            // console.log("abc");
        }
    };
    xmlhttp.open("POST", "/signup", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(newUser));

}


logIn2 = function (email, password) {

    logindata = { 'email': email, 'password': password };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response.message);
                userToken = response.data;
                //view user data
                displayView();
                getUserProfile();
            } else {
                document.getElementById("pwconfirmmsg").innerHTML = response.message;
            }
        } else {
            // console.log("abc");
        }
    };
    xmlhttp.open("POST", "/signin", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(logindata));
}
logIn = function () {
    email = document.getElementById("loginemail").value;
    password = document.getElementById("loginpassword").value;

    logindata = { 'email': email, 'password': password };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response.message);
                userToken = response.data;
                //view user data
                socketConnection();
                displayView();
                getUserProfile();
            } else {
                document.getElementById("pwconfirmmsg").innerHTML = response.message;
            }
        } else {
            // console.log("abc");
        }
    };
    xmlhttp.open("POST", "/signin", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(logindata));
}

getUserProfile = function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                var userData = response.data;
                // console.log(userData);
                var email = userData.email;
                var firstname = userData.firstname;
                var familyname = userData.familyname;
                var gender = userData.gender;
                var city = userData.city;
                var country = userData.country;
                var userProfile = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";

                document.getElementById("userprofile").innerHTML = userProfile;

            } else {
                console.log(response)
            }
        } else {

        }
    };
    var sendtoken = { "token": userToken };
    xmlhttp.open("POST", "/get_user_data_by_token", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(sendtoken));
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
    // var response = serverstub.changePassword(userToken, oldPassword, newPassword);
    var alertplace = document.getElementById("changepwresult");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response);
                validateToken = false;
                alertplace.innerHTML = response.message;
            } else {
                console.log(response);
                alertplace.innerHTML = response.message;
            }
        }
    }
    var send_data = { 'token': userToken, 'oldPassword': oldPassword, 'newPassword': newPassword };
    xmlhttp.open("POST", "/changepassword", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(send_data));
}


signOut = function () {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                userToken = null;
                displayView();
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            } else {
                console.log(response);
            }
        }
    }
    var sendtoken = { "token": userToken };
    xmlhttp.open("POST", "/signout", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(sendtoken));
}

writePost = function (toEmail) {
    if (toEmail == 'own') {
        var post = document.getElementById("postInput").value;
        toEmail = "own";
    } else {
        var post = document.getElementById("postInput2").value;
        toEmail = searchUserEmail;
    }
    // console.log(message);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response);
            } else {
                console.log(response);
            }
        }
    }
    var sendmessage = { "token": userToken, "message": post, "email": toEmail };
    xmlhttp.open("POST", "/post_message", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(sendmessage));

}

reloadPost = function (ofEmail) {
    if (ofEmail == 'own') {
        console.log('own');
        // var response = serverstub.getUserMessagesByToken(userToken);
        var wall = document.getElementById("posts");
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);
                if (response.success) {
                    var msgs = response.data;
                    console.log(msgs);
                    var msgUser = ""
                    for (i = 0; i < msgs.length; i++) {
                        msgUser = msgUser + "User " + msgs[i].sender + ": " + msgs[i].message + "<br>"
                    }
                    wall.innerHTML = msgUser;
                } else {
                    console.log(response);
                }
            }
        }
        var sendmessage = { "token": userToken };
        xmlhttp.open("POST", "/get_user_messages_by_token", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(sendmessage));
    } else {
        // var response = serverstub.getUserMessagesByEmail(userToken, searchUserEmail);
        var wall = document.getElementById("posts2");
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);
                if (response.success) {
                    var msgs = response.data;
                    var msgUser = "";
                    for (i = 0; i < msgs.length; i++) {
                        msgUser = msgUser + "User " + msgs[i].sender + ": " + msgs[i].message + "<br>"
                    }
                    wall.innerHTML = msgUser;
                } else {
                    console.log(response);
                }
            }
        }
        var sendmessage = { "token": userToken, "email": searchUserEmail };
        xmlhttp.open("POST", "/get_user_messages_by_email", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(sendmessage));
    }
    // console.log(searchUserEmail);



}

searchUser = function () {
    var email = document.getElementById("searchuser").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                var userData = response.data;
                var firstname = userData.firstname;
                var familyname = userData.familyname;
                var gender = userData.gender;
                var city = userData.city;
                var country = userData.country;
                var data = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";
            } else {
                var data = response.message;
            }
            document.getElementById("searchresult").innerHTML = data;
        }
    }
    var sendmessage = { "token": userToken, "email": email };
    xmlhttp.open("POST", "/get_user_data_by_email", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(sendmessage));

    searchUserEmail = email;
}

socketConnection = function () {
    var socket = new WebSocket("ws://tddd97-chiti602.herokuapp.com/socket");
    socket.onopen = function () {
        console.log("socket open");
        // var xmlhttp = new XMLHttpRequest();

        // xmlhttp.onreadystatechange = function () {
        //     if (this.readyState == 4 && this.status == 200) {
        //         var response = JSON.parse(xmlhttp.responseText);
        //         if (response.success) {
        //             var email = response.data.email
        //             console.log(email)
        //             socket.send(JSON.stringify({ 'email': email }));
        //         } else {
        //             console.log(response.message);
        //         }
        //     }
        // };

        // var sendtoken = { "token": userToken };
        // xmlhttp.open("POST", "/get_user_data_by_token", true);
        // xmlhttp.setRequestHeader("Content-Type", "application/json");
        // xmlhttp.send(JSON.stringify(sendtoken));
        console.log(userToken)
        socket.send(JSON.stringify({ "token": userToken }));

    };

    socket.onmessage = function (event) {
        userToken = null;
        console.log("ccc");
        displayView();
        console.log(event.data);
    };
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    like(data);
    ev.target.appendChild(document.getElementById(data));
}

like = function (data) {
    if (data == 'thumbsup') {
        var post = "(likes the profile)";
    } else {
        var post = "(dislikes the profile)";
    }
    toEmail = searchUserEmail;
    // console.log(message);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.success) {
                console.log(response);
            } else {
                console.log(response);
            }
        }
    }
    var sendmessage = { "token": userToken, "message": post, "email": toEmail };
    xmlhttp.open("POST", "/post_message", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(sendmessage));

}