import React, { Component } from "react"
import Env from "./three/Env"
import './App.css'

class App extends Component {
  authenticate(){
    return new Promise(resolve => setTimeout(resolve, 2000))
  }
  componentDidMount(){
    this.authenticate().then(() => {
      const ele = document.getElementById('preloader')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 200)
      }
    })
  }
  render() {
    return (
      <div className="App h-100">
        <div className="App-header">
            GNA
        </div>
        <div className="App-intro">
          <Env />
        </div>
      </div>
    )
  }
}
export default App;

