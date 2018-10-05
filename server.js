const fs = require( 'fs' );
const cors = require('cors');
const https = require('https');
const socketIO = require('socket.io')

const privateKey  = fs.readFileSync('./ssl/server.key');
const certificate = fs.readFileSync('./ssl/server.crt');
const ca = fs.readFileSync('./ssl/rootCA.crt');
const credentials = {key: privateKey, cert: certificate, ca: ca};

const port = 8443;

const app = require('express'),
server = require('https').createServer(credentials, app),
io = require('socket.io').listen(server);

io.on('connection', socket => {
  console.log('New client id: '+socket.id+' connected to https server ')
  //console.log(socket.handshake.headers.host)

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('cc', (cd) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('User id: '+socket.id+' Changed Color to: ', cd)
    console.log(socket.handshake.headers.host)
    //console.log('Server host: '+httpServer.address().address+' port: '+httpServer.address().port+' Emit: ', color)
    io.sockets.emit('rnd', cd)
  })
  //Any event
  socket.on('any', () => {
    console.log('User id: '+socket.id+' Any event: ')
    console.log(socket.handshake.headers.host)
    io.sockets.emit('any')
  })
  // disconnect is fired when a client leaves the server
  

  socket.on('disconnect', () => {
    console.log('User disconnected, id:' + socket.id)
    io.clients((error, clients) => {
      if (error) throw error;
      console.log(clients); 
    });
  })
});


server.listen(port, function () {
     let host = server.address().address;
     let port = server.address().port;
     console.log('RIO HTTPS server start ', host, port);
     //console.log(credentials)
});


































































const backendSettings = {
  "scheme":"https / http ",
  "host":"Your website url",
  "port":49165, //port number 
  'sslKeyPath': 'Path for key',
  'sslCertPath': 'path for SSL certificate',
  'sslCAPath': '',
  "resource":"/socket.io",
  "baseAuthPath": '/nodejs/',
  "publishUrl":"publish",
  "serviceKey":"",
  "backend":{
  "port":443,
  "scheme": 'https / http', //whatever is your website scheme
  "host":"host name",
  "messagePath":"/nodejs/message/"},
  "clientsCanWriteToChannels":false,
  "clientsCanWriteToClients":false,
  "extensions":"",
  "debug":false,
  "addUserToChannelUrl": 'user/channel/add/:channel/:uid',
  "publishMessageToContentChannelUrl": 'content/token/message',
  "transports":["websocket",
  "flashsocket",
  "htmlfile",
  "xhr-polling",
  "jsonp-polling"],
  "jsMinification":true,
  "jsEtag":true,
  "logLevel":1
};












