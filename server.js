const fs = require( 'fs' );
const cors = require('cors');
const https = require('https');
const socketIO = require('socket.io')

const privateKey  = fs.readFileSync('./ssl/server.key');
const certificate = fs.readFileSync('./ssl/server.crt');
const ca = fs.readFileSync('./ssl/rootCA.crt');
const credentials = {key: privateKey, cert: certificate, ca: ca};



const port = 4001;
const portS = 8443;



//const SIGNALING_SERVER = 'http:/yarn.ddns.net:4001/';


const app = require('express')(),
server = require('https').createServer(credentials, app),
io = require('socket.io').listen(server, () => { console.log('http')});

//console.log(app)

// app.use(cors({
//   origin: '*'
// }));


/*app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': 'https://rio.net/',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));*/

//const httpServer = http.createServer(app);

//const io = socketIO(httpsServer)
//const io = socketIO(httpServer)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client id: '+socket.id+' connected to server ')
  console.log(socket.handshake.headers.host)

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('User id: '+socket.id+' Changed Color to: ', color)
    console.log(socket.handshake.headers.host)
    //console.log('Server host: '+httpServer.address().address+' port: '+httpServer.address().port+' Emit: ', color)
    io.sockets.emit('change color', color)
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
})

// httpServer.listen(port, function () {
//       let host = {}
//       let port = {}
//      host = httpServer.address().address;
//      port = httpServer.address().port;
//      console.log('RIO HTTP server start', host, port);
// });


const httpsServer = https.createServer(credentials, app);

const IO = socketIO(httpsServer)

// This is what the socket.io syntax is like, we will work this later
IO.on('connection', socket => {
  console.log('New client id: '+socket.id+' connected to server ')
  console.log(socket.handshake.headers.host)

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('User id: '+socket.id+' Changed Color to: ', color)
    console.log(socket.handshake.headers.host)
    //console.log('Server host: '+httpServer.address().address+' port: '+httpServer.address().port+' Emit: ', color)
    IO.sockets.emit('change color', color)
  })
  //Any event
  socket.on('any', () => {
    console.log('User id: '+socket.id+' Any event: ')
    console.log(socket.handshake.headers.host)
    IO.sockets.emit('any')
  })
  // disconnect is fired when a client leaves the server
  

  socket.on('disconnect', () => {
    console.log('User disconnected, id:' + socket.id)
    IO.clients((error, clients) => {
      if (error) throw error;
      console.log(clients); 
    });
  })
})




httpsServer.listen(portS, function () {
     let host = httpsServer.address().address;
     let port = httpsServer.address().port;
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












