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
  'http://localhost:3000','mqttpub','mqttpub');


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
      value: JSON.parse(JSON.stringify(packet.payload.toString('utf8'))),
      topic: packet.topic,
      gpxElement :
            '<trkpt lat='+'"'+jsonData.latitude+'"'
                    +' lon='+'"'+jsonData.latitude+'"'+'>'
                    +"<ele>"+jsonData.altitude+"</ele>"
                    +"<time>"+jsonData.date_utc+"</time>"
            +'</trkpt>',
      options: { 
        messageId:packet.messageId,
        qos : packet.qos,
        retain : packet.retain},
      deviceId: 'device1'
    };
    loopbackClient.post(data,'/api/Locations',
    function(response){
      console.log('\x1Bc');
      console.log("\x1b[33m%s\x1b[0m",new Date(),"\x1b[32mPOST OK\x1b[0m");
      console.log("\x1b[35m",data.options.messageId);
    },
    function(error){
      console.log('\x1Bc');
      console.log("\x1b[33m%s\x1b[0m",new Date(),"\x1b[31mPOST NOT OK\x1b[0m");
      console.log("\x1b[35m%s\x1b[0m",'NO VALID DATA',error);
    });
  }
  
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  console.log('Listening on port',1884);
  console.log('Database', 'mqttlog');
  console.log('Collection','geolocationTrack'); 
}

