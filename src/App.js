import React, { Component } from "react"
import io from "socket.io-client"
import Three from "./Three";

class App extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      endpoint: "https://yarn.ddns.net:8443",
      color: '#795548',
      rnd: 14,
      colors: [
                  '#F44336',
                  '#E91E63',
                  '#9C27B0',
                  '#673AB7',
                  '#3F51B5',
                  '#2196F3',
                  '#03A9F4',
                  '#00BCD4',
                  '#009688',
                  '#4CAF50',
                  '#8BC34A',
                  '#CDDC39',
                  '#FFEB3B',
                  '#FFC107',
                  '#FF9800',
                  '#FF5722',
                  '#795548',
                  '#9E9E9E',
                  '#607D8B'
                ]
    };

  this.socket = io.connect(this.state.endpoint)

  }

  handleClick() {
    const rnd = this.getRandomInt(0, 14);
    this.setState({ rnd: rnd });
    this.setState({ color: this.state.palette[this.state.rnd]});
    this.cc(this.state.color);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  cc = (cd) => {

    this.socket.emit('cc', cd) 
  }

  render() {

    this.socket.on('rnd', (cd) => {
       document.body.style.backgroundColor = cd
     });

    return (
    <div className="Rio">
      <div style={{ textAlign: "center", position: "absolute" }}>
        <button onClick={(e) => this.cc() }>Clear Color</button>
        <button id="rnd" onClick={this.handleClick.bind(this)}>Random Color is: {this.state.color}</button>
      </div>
      

      
      <div>
        {Three}
      </div>
    </div>
    )
  }
}
export default App;