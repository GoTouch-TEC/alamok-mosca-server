var mosca = require('mosca');
const LoopbackClient = require('./LoopBackClient.js');
var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqttlog',
  pubsubCollection: 'geolocationTrack',
  mongo: {}
};

var settings = {
  port: 1884,
  backend: ascoltatore
};

var loopbackClient = new LoopbackClient(
  'http://13.59.16.98:3000','mqttpub','mqttpub');


loopbackClient.login().then(function(data){
  console.log("Token on client",data);
})


var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  
  var jsonData =  JSON.stringify(packet.payload.toString('utf8'));
  console.log(jsonData);
  loopbackClient.post({
    "latitude": jsonData.latitude,
    "longitude": jsonData.longitude,
    "date": jsonData.time_utc,
    "speed": jsonData.speed,
    "altitude": jsonData.altitude,
    "value": packet.payload,
    "topic": "options",
    "options": {},
    "deviceId": "string"
  },'/api/Locations',
  function(data){
    console.log('POST ','OK');
  },
  function(error){
    console.log('POST','NOT OK');
  });
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  console.log('Listening on port',1884);
  console.log('Database', 'mqttlog');
  console.log('Collection','geolocationTrack'); 
}

