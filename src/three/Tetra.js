import React, { Component } from "react"
import * as THREE from "three";
import MapControls from "./controls/MapControls";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let container, controls;
let camera, scene, renderer;

//Light
let dirLight, dirLightHeper, hemiLight, hemiLightHelper;

//Init var slug
let  geometry;
let  material;

//Init var scene
let  ground;
let tetraGeo;

let clock = new THREE.Clock();

class Tetra extends Component {
    constructor(props) {
        super(props);
        this.state = {
          width:  800,
          height: 182
        }
        console.log(props)
    }

    init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color().set('#795548');
        scene.fog = new THREE.Fog( scene.background, 200, 500 );

        // camera
        camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 2000 );
        camera.position.set( -100, 50, -100);
        controls = new MapControls( camera, container );
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 50;
        controls.maxDistance = 350;
        controls.maxPolarAngle = 0.9 * Math.PI / 2;
        controls.minPolarAngle = 0.4 * Math.PI / 2;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // LIGHTS
        hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        scene.add( hemiLight );
        //hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
        //scene.add( hemiLightHelper );

        dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -2, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        scene.add( dirLight );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 4096;
        dirLight.shadow.mapSize.height = 4096;
        var d = 200;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.00001;
        //dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
        //scene.add( dirLightHeper );
        
        // SKYDOME
        var vertexShader = document.getElementById( 'vertexShader' ).textContent;
        var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
        var uniforms = {
            topColor:    { value: new THREE.Color( 0x0077ff ) },
            bottomColor: { value: new THREE.Color( 0xE1F5FE ) },
            offset:      { value: -20 },
            exponent:    { value: 0.8 }
        };
        uniforms.topColor.value.copy( hemiLight.color );
        scene.fog.color.copy( uniforms.bottomColor.value );
        var skyGeo = new THREE.SphereBufferGeometry( 1000, 32, 15 );
        var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
        var sky = new THREE.Mesh( skyGeo, skyMat );
        scene.add( sky );

        // Helpers
        var gridHelper = new THREE.GridHelper( 1000, 20 );
        scene.add( gridHelper );

        // GROUND
        geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
        material = new THREE.MeshPhongMaterial( { color: 0x03A9F4, specular: 0x050505 } );
        material.color.set('#795548');
        ground = new THREE.Mesh( geometry, material );
        ground.rotation.x = -Math.PI/2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        scene.add( ground );
        
        // Icosahedron
        geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
        material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
        tetraGeo = new THREE.Mesh( geometry, material );
        tetraGeo.castShadow = true; //default is false
        scene.add( tetraGeo );

        // Render
        renderer = new THREE.WebGLRenderer({alpha: false, antialias: true });
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( WIDTH, HEIGHT );
        renderer.shadowMap.enabled = true;
        renderer.setSize( WIDTH, HEIGHT );
        
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );

    }

    updateDimensions() {
        let update_width  = window.innerWidth;
        let update_height = window.innerHeight;
        camera.aspect = update_width / update_height;
        camera.updateProjectionMatrix();
        renderer.setSize( update_width, update_height );
        //this.setState({ width: update_width, height: update_height });
    }
        /**
    * Add event listener
    */
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /**
    * Remove event listener
    */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

  render() {

    this.init()

    // function initRen(){
    //     renderer = new THREE.WebGLRenderer({alpha: false, antialias: true });
        
    //     renderer.setPixelRatio( window.devicePixelRatio );
    //     renderer.setSize( WIDTH, HEIGHT );
    //     renderer.shadowMap.enabled = true;
    //     renderer.setSize( WIDTH, HEIGHT );
        

    //     renderer.gammaInput = true;
    //     renderer.gammaOutput = true;
    //     renderer.shadowMap.enabled = true;
    //     container.appendChild( renderer.domElement );
    // }

    function animate() {

        requestAnimationFrame( animate );

        var delta = clock.getDelta();
        var timer = Date.now() * 0.01;

        tetraGeo.position.set(
            Math.cos( timer * 0.1 ) * 30,
            Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
            Math.sin( timer * 0.1 ) * 30
        );
        tetraGeo.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
        tetraGeo.rotation.z = timer * 0.8;
     
        ren(delta);
    }

    function ren(delta) {
        renderer.render( scene, camera );
    }

    //initRen()
    ren()
    animate()

    return (
    <div className="Tetra">

    </div>
    )
  }

}


export default Tetra;