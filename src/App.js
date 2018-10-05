import React, { Component } from "react";
import io from "socket.io-client";
import Three from "./Three";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://yarn.ddns.net:4001",
      endpointS: "https://yarn.ddns.net:8443",
      color: 'whit'
    };

   //socketAddr is server uri  ex. https://ww2.my_example.com:3300
   //var socket = io.connect(socketAddr,{'flash policy port':3300});
   //socket.on('connect', function () { .....
  //this.socket = io.connect('https://yarn.ddns.net',{secure: true, port:4001});
  //this.socket = io(this.endpointS,{'flash policy port':3000, secure:true})
  this.socket = io(this.state.endpointS)
  // this.socket = io(':3000'),
  //       this.socket.on('connect', function() {
  //           this.socket.emit('subscribe')
  //       });



  }

  send = (cd) => {
    //const socket = socketIOClient(this.state.endpoint);
    this.socket.emit('change color', cd) // change 'red' to this.state.color
  }

  any = () => {
    //const socket = socketIOClient(this.state.endpoint);
    this.socket.emit('any') // change 'red' to this.state.color
  }

  setColor = (color) => {
    this.setState({ color })
  }
  

  readColor = (color) => {
        switch (color) {
          case "yellow": this.send('blue');
          case "grey": this.send('yellow');
          case "red":this.send('green');
          case "green":this.send('blue');
          case "blue": this.send('grey');
          default: this.send('white');
        }
  }

  render() {

    //const socket = socketIOClient(this.state.endpoint);
    this.socket.on('change color', (col) => {
       document.body.style.backgroundColor = col
     })

    this.socket.on('any', () => {
       alert('Другое событие');
     })

    return (
    <div className="Rio">
      <div style={{ textAlign: "center", position: "absolute" }}>
        <button onClick={() => this.send() }>Clear Color</button>
        <button id="blue" onClick={() => this.send('blue')}>Blue</button>
        <button id="red" onClick={() => this.send('red')}>Red</button>
        <button id="any" onClick={(e) => this.any()}>Click to Any event </button>
      </div>
      <div>
        {Three}
      </div>
    </div>
    )
  }
}
export default App;