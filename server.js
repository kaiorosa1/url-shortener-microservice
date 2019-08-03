'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
var schema = new Schema({
  original_url: String,
  short_url: Number
});
// Short Model
var Short = mongoose.model('Short',schema);
var counter = 1;

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
  // finding the website with the short url
  Short.find({short_url: String(req.params.id)},function(err,data){
    if(err){
      return err; 
    }else{
      //retrieving the data from the DB and redirecting to the orignal link
      if(data[0] !== undefined){
        res.status(301).redirect(data[0].original_url);
      }else{
        res.send("It's an invalid link");
      } 
      
    }
  });
});
  
// POST Routes
app.post("/api/shorturl/new",function(req, res){
  // steps
  // get the website from the post form
  // show the json response 
  // save in the database in the same format
  
  // concatenate the complete url 
  
  var originalURL = req.body.url.split('/')[2]; 
  
  dns.lookup(originalURL,function(err,address,family){
    // verify the pattern here
    // verify https and the slash routes
    if(err){
      // it's generating an error
      res.json({error: 'invalid URL'});
    }else{
      // generate differente numbers to each website
      // saving
      Short.find({original_url: req.body.url},function(err,data){
        if(err){
          return err;
        }else{  
           if(data !== null){
             res.json({original_url: data[0].original_url, short_url: data[0].short_url});
           }else{
              res.json({original_url: originalURL, short_url: counter});
               Short.create({original_url: req.body.url, short_url: counter},function(err,dt){
               if(err){
                 return err;
               }
               counter++;
             });

           }

        }
      });
      
     
    }
  });
  
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});