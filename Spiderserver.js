var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('expmanager.db');
var bodyParser = require('body-parser');
var port = 3000;
var passwordHash = require('password-hash');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, function () {
    console.log("Listening on port " + port);
});
// Enabling CORS
app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Registering new user. Adds to Auth table 
var user;
app.post('/register', function (req, res) {
    
    console.log("new user " + req.body.username);
    db.all('SELECT * from Auth  where Username=$user',
        {
            $user: req.body.username
        },
        function (err, rows) {
            console.log(rows);
            if (rows.length > 0) {
                console.log("User already exists");
                res.render('login', { loginmsg: "", regmsg: "Username already taken" });
            }
            else {
                db.run('INSERT into Auth (Username,Password) VALUES (?,?)', [req.body.username, passwordHash.generate(req.body.password)], function (err) {
                    if (err)
                        console.log(err.message);
                    else {
                        console.log("User added");
                        user = req.body.username;
                        afterlogin(req, res);
                    }
                });
            }
        });

});  
// Check login data
var check = false;
app.post('/login', function (req, res) {
    db.get('SELECT Password from Auth  where Username=$user',
        {
            $user: req.body.username
        },
        function (err, rows) {
            console.log(rows);
            console.log(req.body.username);
           //  console.log(rows.Password);
            if (passwordHash.verify(req.body.password, rows.Password)) {
                console.log("Login Successful");
                user = req.body.username;
                afterlogin(req, res);
            }

            else {
                console.log("fail");
                res.render('login', { loginmsg: "Incorrect username/password", regmsg: "" });
            }
        });
    console.log(check);
});
var val=0;
function afterlogin(req, res) {
    res.cookie("username", user);
    db.get('SELECT sum(amount) as sum from data where Username=$user', { $user: user }, function (err, rows) {
        if (err)
            console.log(err.message);
        else {
            val = rows.sum; console.log(rows); console.log(rows.sum);
            console.log("val in db " + val);
            db.all('SELECT Title,Desc,Amount from data where Username=$un', { $un: user }, function (err, rows) {
                if (err)
                    console.log(err.message);
                else {
                    // list = rows;
                    console.log(rows);
                    res.render('app', { expense: val, exp: rows, addmsg: "", deletemsg: "" });
                }
            });
        }
    });
    console.log("val otside " + val);
}
// Add expenses to data table
var amt = 0;
app.post('/add', function (req, res) {
    user = req.cookies.username;
    console.log(req.cookies);
    console.log("cookie " + user);
    console.log(user);
    let title = req.body.title;
    let desc = req.body.desc;
    let amount = req.body.amt;
    var list=[];
    db.run('INSERT into data values (?,?,?,?)', [user, title, desc, amount], function (err) {
        if (err) {
            console.log(err.message);
            db.get('SELECT sum(amount) as sum from data where Username=$user', { $user: user }, function (err, rows) {
                if (err)
                    console.log(err.message);
                else {
                    val = rows.sum; console.log(rows); console.log(rows.sum);
                    console.log("val in db " + val);
                    db.all('SELECT Title,Desc,Amount from data where Username=$un', { $un: user }, function (err, rows) {
                        if (err)
                            console.log(err.message);
                        else {
                            // list = rows;
                            console.log(rows);
                            res.render('app', { expense: val, exp: rows, addmsg: "Failed to add expense", deletemsg: "" });
                        }
                    });
                }
            });
        }
        else {
            console.log("Expense added");
            db.get('SELECT sum(amount) as sum from data where Username=$user', { $user: user }, function (err, rows) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    amt = rows.sum; console.log(rows); console.log(rows.sum);
                    console.log("amt in add " + amt);
                    db.all('SELECT Title,Desc,Amount from data where Username=$un', { $un: user }, function (err, rows) {
                        if (err)
                            console.log(err.message);
                        else {
                            // list = rows;
                        console.log(rows);
                        res.render('app', { expense: amt, exp: rows, addmsg: "Expense added", deletemsg: "" });
                    }
                    });
                    
                }
            });  
        }
    });
});
// Login page on localhost:3000
app.get('/', function (req, res) {
    res.render('login', { loginmsg: "", regmsg: "" });
});
// Delete expense using Title ie primary key 
app.post('/delete', function (req, res) {
    db.run('DELETE from data where Title=$title AND Username=$uname', { $title: req.body.title, $uname: user }, function (err, rows) {
        if (err) {
            console.log("delete mein error " + err.message);
            db.get('SELECT sum(amount) as sum from data where Username=$user', { $user: user }, function (err, rows) {
                if (err)
                    console.log(err.message);
                else {
                    val = rows.sum; console.log(rows); console.log(rows.sum);
                    console.log("val in db " + val);
                    db.all('SELECT Title,Desc,Amount from data where Username=$un', { $un: user }, function (err, rows) {
                        if (err)
                            console.log(err.message);
                        else {
                            // list = rows;
                            console.log(rows);
                            res.render('app', { expense: val, exp: rows, addmsg: "", deletemsg: "Failed to delete expense" });
                        }
                    });
                }
            });
        }
        else {
            console.log("exp deleted");
            db.get('SELECT sum(amount) as sum from data where Username=$user', { $user: user }, function (err, rows) {
                if (err)
                    console.log(err.message);
                else {
                    val = rows.sum; console.log(rows); console.log(rows.sum);
                    console.log("val in db " + val);
                    db.all('SELECT Title,Desc,Amount from data where Username=$un', { $un: user }, function (err, rows) {
                        if (err)
                            console.log(err.message);
                        else {
                            // list = rows;
                            console.log(rows);
                            res.render('app', { expense: val, exp: rows, addmsg: "", deletemsg: "Expense deleted !" });
                        }
                    });
                }
            });
        }
    });
});
