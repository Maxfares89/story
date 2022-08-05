//jshint esversion:6
////////////////////////////////////////// Env Variables ///////////////////////////////////////////////
require('dotenv').config()

// ********************************** Express init ******************************************************
const express = require("express");
const app = express();


// ************************************* Body-Parser ****************************************************
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

// **************************************** import files ************************************************
const lo = require('lodash');

// ******************************************* EJS init *************************************************
const ejs = require("ejs");
app.set('view engine', 'ejs');


// ******************************************** Stylesheet CSS ******************************************
app.use(express.static("public"));



///  ************************************** DataBase init *************************************************
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');



mongoose.connect('mongodb://localhost:27017/SecretsDB', {
  useNewUrlParser: true
});
// mongoose.connect('mongodb+srv://maxfares:Dfr23889$@firstcluster.dhtdh.mongodb.net/ToDoListDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String

});



var secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/secrets", function(req, res) {
  res.render("secrets");
});

app.get("/submit", function(req, res) {
  res.render("submit");
});



app.post("/register", function(req, res) {
  const uname = req.body.username;
  const passw = req.body.password;

  User.findOne({
    email: uname
  }, function(err, found) {
    console.log(found);
    if (found) {
      const mess = "Your Account Already Exists";
      res.render("messages",{message: mess, status: 0});
    } else {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          const mess = "user registered successfully";
          res.render("messages",{message: mess, status: 0});
        }
      });


    }
  });


});

app.post("/login", function(req, res) {
  const uname = req.body.username;
  const passw = req.body.password;




  User.findOne({
    email: uname
  }, function(err, found) {
    // console.log(found)
    if (found) {
      if (found.password === passw){


        res.render("secrets");
      }

      else {
        const mess = "Wrong Password, try again";
        res.render("messages",{message: mess, status: 0});

      }
    } else {
      const mess = "No Account Associated to this Email, You Need to Register First";
      res.render("messages",{message: mess, status: 1});

    }
  });
});




// *****************************************Listen port 3000/heroku********************************
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
