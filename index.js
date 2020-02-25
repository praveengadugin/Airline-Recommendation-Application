var express = require('express');
var bodyParser = require('body-parser'); //for sending response to client
var app = express();
var fs = require('fs-extra'); //file-stream reader-writer
var request = require('request'); //http requests
// var mysql = require('mysql');
// const mariadb = require('mariadb');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port); //port to run the program
});

var http = require('http');

// const pool = mariadb.createPool({
//      host: '192.168.56.101', 
//      user:'root', 
//      port: 3306,
//      ssl: false,
//      connectionLimit: 5
// });

var securityDelay;
var taxiDelay;
var cancelledFlights;
var selectedCause;
var selectedAirline;
var selectedReason;

var MongoClient = require('mongodb').MongoClient, format = require('util').format, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/istm622_603';

// route to '/' to return the html file
app.get('/', function (req, res, next) {
  res.sendFile('home.html');
});

app.post('/input1', function (req, res) {

  selectedCause = req.body.input1;
  console.log(selectedCause);

  MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    // console.log("Connected successfully to server");
    const database_name = db.db('istm622_603');
    
    if (selectedCause == "A")
    {
      var ques1 = database_name.collection('flight_info').aggregate([ {$group: { _id: "$dest", total_flights: {$sum:1}, total_delay: {$sum: "$carrier_delay"}} }, {$match: {"total_flights": {$gt: 10000} }}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
      {
        if (err){
          console.log(err);
        }
        else{
          console.log(doc);
          securityDelay = doc;
          res.send(securityDelay);
        }
      });
    }
    else if (selectedCause == "B")
    {
      var ques1 = database_name.collection('flight_info').aggregate([ {$group: { _id: "$dest", total_flights: {$sum:1}, total_delay: {$sum: "$weather_delay"}} }, {$match: {"total_flights": {$gt: 10000} }}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
      {
        if (err){
          console.log(err);
        }
        else{
          console.log(doc);
          securityDelay = doc;
          res.send(securityDelay);
        }
      });
    }
    else if (selectedCause == "C")
    {
      var ques1 = database_name.collection('flight_info').aggregate([ {$group: { _id: "$dest", total_flights: {$sum:1}, total_delay: {$sum: "$nas_delay"}} }, {$match: {"total_flights": {$gt: 10000} }}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
      {
        if (err){
          console.log(err);
        }
        else{
          console.log(doc);
          securityDelay = doc;
          res.send(securityDelay);
        }
      });
    }
    else
    {
      var ques1 = database_name.collection('flight_info').aggregate([ {$group: { _id: "$dest", total_flights: {$sum:1}, total_sec_delay: {$sum: "$security_delay"}, total_late_delay: {$sum: "$late_aircraft_delay"}} }, {$match: {"total_flights": {$gt: 10000} }}, {$addFields: {total_delay: {$sum: ["$total_sec_delay", "$total_late_delay"]}}}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
      {
        if (err){
          console.log(err);
        }
        else{
          console.log(doc);
          securityDelay = doc;
          res.send(securityDelay);
        }
      });
    }
  });
});

app.post('/input2', function (req, res) {

  selectedAirline = req.body.input2;
  console.log(selectedAirline);

  MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    // console.log("Connected successfully to server");
    const database_name = db.db('istm622_603');
        
    var ques2 = database_name.collection('flight_info').aggregate([ {$match: {"op_carrier": selectedAirline}}, {$group: { _id: "$origin", total_flights: {$sum:1}, total_delay: {$sum: "$taxi_out"}} }, {$match: {"total_flights": {$gt: 5000} }}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
    {
      if (err){
        console.log(err);
      }
      else{
        console.log(doc);
        taxiDelay = doc;
        res.send(taxiDelay);
      }
    });
  });
});

app.post('/input3', function (req, res) {

  selectedReason = req.body.input3;
  console.log(selectedReason);

  MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    // console.log("Connected successfully to server");
    const database_name = db.db('istm622_603');
        
    var ques3 = database_name.collection('flight_info').aggregate([ {$match: { "cancellation_status": 1, "cancellation_code": selectedReason} }, {"$group" : {_id:"$op_carrier", count:{$sum:1}}}, {$match: {"count": {$gt: 1000} }}, {$sort: {"count": -1}}, {$limit: 10} ]).toArray(function(err, doc)
    {
      if (err){
        console.log(err);
      }
      else{
        console.log(doc);
        cancelledFlights = doc;
        res.send(cancelledFlights);
      }
    });
  });
});

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
const database_name = db.db('istm622_603');
  

  var ques1 = database_name.collection('flight_info').aggregate([ {$group: { _id: "$dest", total_flights: {$sum:1}, total_sec_delay: {$sum: "$security_delay"}, total_late_delay: {$sum: "$late_aircraft_delay"}} }, {$match: {"total_flights": {$gt: 10000} }}, {$addFields: {total_delay: {$sum: ["$total_sec_delay", "$total_late_delay"]}}}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
  {
    if (err){
      console.log(err);
    }
    else{
      console.log(doc);
      securityDelay = doc;
    }
  });


var ques2 = database_name.collection('flight_info').aggregate([ {$match: {"op_carrier": "DL"}}, {$group: { _id: "$origin", total_flights: {$sum:1}, total_delay: {$sum: "$taxi_out"}} }, {$match: {"total_flights": {$gt: 5000} }}, {$addFields: {avg_delay: {$divide: ["$total_delay", "$total_flights"]}}}, {$project: {total_delay:1, total_flights:1, round_delay: {$round: ["$avg_delay",0]}}}, {$sort: {"round_delay": -1}}, {$limit: 10} ]).toArray(function(err, doc)
  {
    if (err){
      console.log(err);
    }
    else{
      console.log(doc);
      taxiDelay = doc;
    }
  });


  var ques3 = database_name.collection('flight_info').aggregate([ {$match: { "cancellation_status": 1, "cancellation_code": "A"} }, {"$group" : {_id:"$op_carrier", count:{$sum:1}}}, {$match: {"count": {$gt: 1000} }}, {$sort: {"count": -1}}, {$limit: 10} ]).toArray(function(err, doc)
  {
    if (err){
      console.log(err);
    }
    else{
      console.log(doc);
      cancelledFlights = doc;
    }
  });

  db.close();
});


app.get('/test', function(req, res) {
	res.send(JSON.stringify({"status": 200, "error": null, "response": {securityDelay,taxiDelay,cancelledFlights}}));
});


// app.use(function(req, res, next){
// 	res.locals.connection = mysql.createConnection({
// 		host     : 'localhost',
// 		user     : 'root',
// 		password : ' ',
// 		database : 'test'
// 	});
// 	res.locals.connect();
// 	next();
// });

// app.use('/api/flight', flight);

// router.get('/', function(req, res, next) {
// 	res.locals.connection.query('SELECT * from flight', function (error, results, fields) {
// 		if (error) throw error;
// 		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
// 	});
// });5