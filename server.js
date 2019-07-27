'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

// body parser required
var bodyParser = require('body-parser');
// dns required
var dns = require('dns');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:id",function(req, res){
  // check the id in the database and then redirect 
  // the webside will be save in the same pattern as the json
  res.send("You shouldn't be seeing this!");
});
  
app.post("/api/shorturl/new",function(req, res){
  // steps
  // get the website from the post form
  // show the json response 
  // save in the database in the same format
  
  //not working  properly yet
  var originalURL = req.body.url; 
  dns.lookup(originalURL,function(err,address,family){
    
    if(err){
      // it's generating an error
      res.json({error: 'invalid URL'});
    }else{
      res.json({original_url: address, short_url: 1});
    }
  });
  
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});