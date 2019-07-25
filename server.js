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

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  // incomplete
  res.json({greeting: req.protocol + req.host + req.originalUrl});
});


app.post("/api/shorturl/new",function(req, res){
  var originalURL = String(req.body.url); // how to get this as a string
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