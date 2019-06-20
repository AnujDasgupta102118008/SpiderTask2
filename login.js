const xhr = new XMLHttpRequest();
String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
    }
    return content;
};
$("#registerForm").submit(function (event) {
    event.preventDefault();
   let n = document.getElementById("register-name").value;
    let un = document.getElementById("register-username").value;
    let pass = document.getElementById("register-password").value;
    let query = "username={0}&password={1}".format(un, pass);
    console.log(query);
    xhr.open("POST", "http://localhost:3000/register");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(query);
});


$("#loginForm").submit(function (event) {
    event.preventDefault();
    let un = document.getElementById("login-username").value;
    let pass = document.getElementById("login-password").value;
    let query = "username={0}&password={1}".format(un, pass);
    console.log(query);
    xhr.open("POST", "http://localhost:3000/login");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(query);
});
