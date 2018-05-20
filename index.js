var mosca = require('mosca');
var axios = require('axios');
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
var server = new mosca.Server(settings);
//Login user:
var tokenSession = '';
axios.post('http://13.59.16.98:3000/api/AlamokUsers/login',{"username":"mqttpub","password":"mqttpub" })
.then(function(data){console.log("Data Loopback",data.data);})
.catch(function(error){console.log("Error Looback", error);});



server.on('clientConnected', function(client) {

    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  var jsonData =  JSON.stringify(packet.payload.toString('utf8'));
  console.log('Published',jsonData);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  console.log('Listening on port',1884);
  console.log('Database', 'mqttlog');
  console.log('Collection','geolocationTrack'); 
}

