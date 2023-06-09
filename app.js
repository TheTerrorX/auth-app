//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
require('dotenv').config();
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/authDB';

mongoose.connect(mongoDB, { useNewUrlParser: true });

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model('User', userSchema);


app.get('/', function (req, res) {
    res.render('home')
});

app.get('/login', function (req, res) {
    res.render('login')
});

app.get('/register', function (req, res) {
    res.render('register')
});

app.get('/secrets', function (req, res) {
    res.render('secrets')
});

app.get('/submit', function (req, res) {
    res.render('submit')
});

app.post('/register', function (req, res) {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(
            function () {
                res.render('secrets')
            })
        .catch(function (err) {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        })
});


app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((foundUser) => {
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }).catch((err) => {
        console.log(err);
    });

});

    app.listen(3000, function () {
        console.log('====================================');
        console.log('SERVER STARTED PORT:3000');
        console.log('====================================');
    })