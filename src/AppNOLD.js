import React, { Component } from "react"

//import ThreeScene from './three/ThreeScene'
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
      <ThreeScene />
    )
  }
}
export default App;

