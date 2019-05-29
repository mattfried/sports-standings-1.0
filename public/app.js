const socket = io();

// Receive nhl data from index.js
socket.on('nhl-data', function(data) {
  let nhlData;
  nhlData = data;
  
  console.log('this is the data:');
  console.log(nhlData);


});
