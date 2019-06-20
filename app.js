// JavaScript source code
var expense = 0;
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('expmanager.db');
function addexp() {
    let list = document.getElementById('explist');
    var entry = document.createElement('li');
    let val = document.getElementById("amount").value;
    let Title = document.getElementById("title").value;
    let Desc = document.getElementById("desc").value;
    expense += parseInt(val);
    let s = Title + "        " + val;
    document.getElementById("bal").innerHTML = expense;
    var expand = document.createElement("button");
    expand.innerHTML = '<img scr="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMgMnY5aDl2MmgtOXY5aC0ydi05aC05di0yaDl2LTloMnptMi0yaC02djloLTl2Nmg5djloNnYtOWg5di02aC05di05eiIvPjwvc3ZnPg==">'
    var delbutton = document.createElement("button");
    delbutton.innerHTML =
        '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik05IDNoNnYtMS43NWMwLS4wNjYtLjAyNi0uMTMtLjA3My0uMTc3LS4wNDctLjA0Ny0uMTExLS4wNzMtLjE3Ny0uMDczaC01LjVjLS4wNjYgMC0uMTMuMDI2LS4xNzcuMDczLS4wNDcuMDQ3LS4wNzMuMTExLS4wNzMuMTc3djEuNzV6bTExIDFoLTE2djE4YzAgLjU1Mi40NDggMSAxIDFoMTRjLjU1MiAwIDEtLjQ0OCAxLTF2LTE4em0tMTAgMy41YzAtLjI3Ni0uMjI0LS41LS41LS41cy0uNS4yMjQtLjUuNXYxMmMwIC4yNzYuMjI0LjUuNS41cy41LS4yMjQuNS0uNXYtMTJ6bTUgMGMwLS4yNzYtLjIyNC0uNS0uNS0uNXMtLjUuMjI0LS41LjV2MTJjMCAuMjc2LjIyNC41LjUuNXMuNS0uMjI0LjUtLjV2LTEyem04LTQuNXYxaC0ydjE4YzAgMS4xMDUtLjg5NSAyLTIgMmgtMTRjLTEuMTA1IDAtMi0uODk1LTItMnYtMThoLTJ2LTFoN3YtMmMwLS41NTIuNDQ4LTEgMS0xaDZjLjU1MiAwIDEgLjQ0OCAxIDF2Mmg3eiIvPjwvc3ZnPg==">';
    delbutton.className = "delbutton";
    delbutton.onclick = function () {
        console.log("delbutton pressed");
        this.parentElement.parentElement.removeChild(delbutton.parentElement);
        expense -= parseInt(val);
        document.getElementById("bal").innerHTML = expense; 
    };
    expand.onclick = function () {
        s += Desc;
    };
    entry.appendChild(document.createTextNode(s));
    entry.appendChild(delbutton);
    entry.appendChild(expand);
    list.appendChild(entry);

}