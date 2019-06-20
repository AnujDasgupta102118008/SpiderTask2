
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('expmanager.db');
var strformat = require('string-format');
var bodyParser = require('body-parser');
var port = 3000;
var fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, function () {
    console.log("Listening on port " + port);
}
);
app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

// Registering new user. Adds to Auth table 
app.post('/register', function (req, res) {
    console.log("new user " + req.body.username);
    db.all('SELECT * from Auth  where Username=$user',
        {
            $user: req.body.username          
        },
        function (err, rows) {
            console.log(rows);
            if (rows.length > 0)
                console.log("User already exists");
            else {
                db.run('INSERT into Auth (Username,Password) VALUES (?,?)', [req.body.username, req.body.password], function (err) {
                    if (err)
                        console.log(err.message);
                    else {
                        console.log("User added");
                        fs.readFile(__dirname+'/app.html', function (err, data) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write(data);
                            return res.end();
                            //console.log(err.message);

                        });
                    }
                });   
            }
        }

    );
   
});
// Add expenses to data table
app.post('/add', function (req, res) {
    let user = req.body.username;
    let title = req.body.title;
    let desc = req.body.desc;
    let amount = req.body.amt;

    db.run('INSERT into data values (?,?,?,?)', [user,title, desc,amount], function (err) {
        if (err)
            console.log(err.message);
        else
            console.log("Expense added");
    }
        );
});
// check login data
app.post('/login', function (req, res) {
    db.all('SELECT * from Auth  where Username=$user AND Password=$pw',
        {
            $user: req.body.username,
            $pw: req.body.password
        },
        function (err, rows) {
            console.log(rows);
            if (rows.length > 0)
                console.log("Login Successful");
            else
                console.log("fail");
        }

    );
});
