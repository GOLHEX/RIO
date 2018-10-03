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
            break;
          case "grey": this.send('red');
            break;
          case "red":this.send('green');
            break;
          case "green":this.send('blue');
            break;
          case "blue": this.send('grey');
            break;
          default: this.send('white');
          break;
        }
  }

  render() {

    //const socket = socketIOClient(this.state.endpoint);
     this.socket.on('change color', (col) => {
       document.body.style.backgroundColor = col
       //this.setColor(col)
     })

    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Clear Color</button>
        <button id="blue" onClick={() => this.send('blue')}>Blue</button>
        <button id="red" onClick={() => this.send('red')}>Red</button>
        <button id={this.state.color} onClick={(e) => this.readColor(this.state.color)}>Current {this.state.color}, Click to Switch next </button>


        {Three}

      </div>
    )
  }
}
export default App;