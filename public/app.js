const socket = io();

socket.on('nhl-data', function(data) {
  let nhlData;

  nhlData = data;
  console.log(nhlData);
  console.log('do stuff here with sports data');
});
