import React, { Component } from 'react';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
 



      // envmap
        let path = 'textures/cube/Bridge2/';
        let format = '.jpg';
        let envMap = new THREE.CubeTextureLoader().load( [
          path + 'posx' + format, path + 'negx' + format,
          path + 'posy' + format, path + 'negy' + format,
          path + 'posz' + format, path + 'negz' + format
        ] );
        let scene = new THREE.Scene();
        //scene.background = envMap;
        let light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
        light.position.set( 0, 1, 0 );
        scene.add( light );


let loader = new GLTFLoader();
loader.load( 'models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', function ( gltf ) {
  gltf.scene.traverse( function ( child ) {
    if ( child.isMesh ) {
      child.material.envMap = envMap;
    }
  } );
  scene.add( gltf.scene );
}, undefined, function ( e ) {
  console.error( e );
} );




class ThreeScene extends Component{
  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    

    // const loader = new FBXLoader();
    // const fbx = [];

    // loader.load( 'models/mixamo.fbx', function ( model ) {
    //     //const mixer = new THREE.AnimationMixer(model);
    //     //mixer.clipAction(model.animations[0]).play();
    //     scene.add( model );
    //     //fbx.push({model, mixer});
    // } );



    //ADD SCENE
    this.scene = scene;

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 4

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)






    this.start()
  }

componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

stop = () => {
    cancelAnimationFrame(this.frameId)
  }

animate = () => {
   this.cube.rotation.x += 0.01
   this.cube.rotation.y += 0.01

   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }

renderScene = () => {
  this.renderer.render(this.scene, this.camera)
}

render(){
    return(
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }} />
    )
  }
}

export default ThreeScene