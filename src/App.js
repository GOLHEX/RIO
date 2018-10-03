import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Three from "./Three";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:4001",
      color: 'white'
    };
    this.socket = socketIOClient(this.state.endpoint);
  }

  send = (cd) => {
    //const socket = socketIOClient(this.state.endpoint);
    this.socket.emit('change color', cd) // change 'red' to this.state.color
  }

  setColor = (color) => {
    this.setState({ color })
  }
  
  readColor = (color) => {
        switch (color) {
          case "yellow": this.send('blue');
          case "grey": this.send('red');
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

    return (
    <div className="Rio">
      <div style={{ textAlign: "center", position: "absolute" }}>
        <button onClick={() => this.send() }>Clear Color</button>
        <button id="blue" onClick={() => this.send('blue')}>Blue</button>
        <button id="red" onClick={() => this.send('red')}>Red</button>
        <button id={this.state.color} onClick={(e) => this.readColor(this.state.color)}>Current {this.state.color}, Click to Switch next </button>
      </div>
      <div>
        {Three}
      </div>
    </div>
    )
  }
}
export default App;