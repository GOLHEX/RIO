const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// our localhost port
const port = 4001
// our host ip
const host = '127.0.0.2'

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client id: '+socket.id+' connected to server '+server.address().address)
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('User id: '+socket.id+' Changed Color to: ', color)
    console.log('Server host: '+server.address().address+' port: '+server.address().port+' Emit: ', color)
    io.sockets.emit('change color', color)
  })
  //Any event
  socket.on('any', () => {
    console.log('User id: '+socket.id+' Any event: ')
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


server.listen(port, () => console.log(`Listening on port ${port}`))







// server.listen(port, host, function () {
//      var host = server.address().address;
//      var port = server.address().port;
//      console.log('RIO server listening at http://%s:%s', host, port);
// });






// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'https://yarn.ddns.net:8443');

//     // Request methods you wish to allow
//     //res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

//     // Request headers you wish to allow
//     //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     //res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
