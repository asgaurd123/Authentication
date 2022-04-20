require("dotenv").config()

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

const mongoose = require('mongoose');

const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const session=require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(session({
    secret:"Our Little secret only few people can access it so ya",
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

//connect to mongo db and creating User DB

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

//User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

//User Model
const User = mongoose.model("User", UserSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
    if(req.isAuthenticated()){
        res.render('secrets')
    }
    else{
        res.redirect('/login')
    }
});

//register post request

app.post('/register', function (req, res) {
    User.register({username:req.body.username},req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    });

});

//login post 
app.post('/login', function (req, res) {

    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err)
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })

});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})




app.listen(3000, function (req, res) {
    console.log("server started at 3000")
});