//==========express=============
const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const data = require('./data.js');

// Global variable to store the latest NHL results
let latestData;


// Load the NHL data for when client's first connection
// This will be updated every 10 minutes
data.getData().then((result) => {
  latestData = result;
});

// Route created at the root of the site "/"
// The result of the route returns HTML file: index.html
/*
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
*/

/***** The following code for serving static files
       supersedes the route code above *****/

// Serve all static files in 'public' directory
app.use(express.static('public'));

http.listen(3000, function() {
  console.log('HTTP server started on port 3000');
});


io.on('connection', function(socket) {
  console.log('Client connection received');

  // When clients connect, send the latest NHL data
  socket.emit('data', latestData);

  // socket.on('receivedFromClient', function(data) {
  //   console.log(data);
  // });
});


// Refresh data
setInterval( function() {
  data.getData().then((result) => {
    // Update latest results for when new client's connect
    latestData = result;

    // Send it to all connected clients
    io.emit('data', result);

    console.log('Last updated: ' + new Data());
  });
}, 300000);
