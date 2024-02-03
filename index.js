const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./db');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3000 || process.env.PORT;
const dbUrl = 'mongodb+srv://admin:9BXQgyu8QGN6mjh1@cluster0.5ban3pt.mongodb.net/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

mongoose.connect(dbUrl);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username, password});
        if(user){
            req.session.userId = user._id;
            res.send("Login Successful!");
        } else{
            res.send("Wrong username or password");
        }
    } catch(error){
        res.send("Error logging in");
    }
})

app.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
        // res.send('Signup successful!');

      } catch (error) {
        res.send('Error during Signup');
      }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})