require("dotenv").config()

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltround = 10;
//connect to mongo db and creating User DB
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

//User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});





//User Model
const User = mongoose.model("User", UserSchema)


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.use(express.static("public"));


//routes
app.get('/', function (req, res) {
    res.render("home");
});

app.get('/login', function (req, res) {
    res.render("login");
});


app.get('/register', function (req, res) {
    res.render("register");
});

app.get('/secrets', function (req, res) {
    res.render("secrets")
});

//register post request

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltround, function (err, hash) {

        const user = new User({
            email: req.body.username,
            //Encrypting our passwords
            password: hash

        });
        user.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Succesfully addeed user");
                res.render("secrets");

            }
        })

    });

});

//login post 
app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    //Finding the user 
    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log("User not found");
        }
        else {
            if (foundUser) {
                bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result==true){
                        res.render("secrets")
                    }
                    else{
                        console.log("Wrong password")
                    }
                })
            }
        }
    })
})

app.get('/', function (req, res) {
    res.render();
});


app.listen(3000, function (req, res) {
    console.log("server started at 3000")
});