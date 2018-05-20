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
  if(packet.topic == "fonagotouch"){

    var jsonData =JSON.parse(packet.payload.toString('utf8').replace(/\'/g,'\"'));
    var data = {
      latitude: jsonData.latitude,
      longitude: jsonData.longitude,
      date: jsonData.date_utc,
      speed: jsonData.speed,
      altitude: jsonData.altitude,
      value: packet.payload,
      topic: packet.topic,
      options: { 
        messageId:packet.messageId,
        qos : packet.qos,
        retain : packet.retain},
      deviceId: 'device1'
    };
  }
  loopbackClient.post(data,'/api/Locations',
  function(response){
    console.log('POST ','OK',data.options.messageId);
  },
  function(error){
    console.log('POST','NOT OK','NO VALID DATA',data);
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

