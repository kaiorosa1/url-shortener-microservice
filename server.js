'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

var cors = require('cors');

// body parser required
const bodyParser = require('body-parser');
// dns required
const dns = require('dns');

const app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

// mongodb connection
mongoose.connect(process.env.MONGOLAB_URI);
// create the schema to save the website and the short url
const Schema = mongoose.Schema({
  original_url: String,
  short_url: Number
});
// Short Model
const Short = mongoose.model('Short',Schema);

app.use(cors());

// mount body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

/* ROUTES */
// GET routes
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:id",function(req, res){
  // check the id in the database and then redirect 
  // the webside will be save in the same pattern as the json
  res.send("You shouldn't be seeing this!");
});
  
// POST Routes
app.post("/api/shorturl/new",function(req, res){
  // steps
  // get the website from the post form
  // show the json response 
  // save in the database in the same format
  
  var originalURL = req.body.url.split('/')[2]; 
  dns.lookup(originalURL,function(err,address,family){
    // verify the pattern here
    // verify https and the slash routes
    if(err){
      // it's generating an error
      res.json({error: 'invalid URL'});
    }else{
      res.json({original_url: originalURL, short_url: 1});
    }
  });
  
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});