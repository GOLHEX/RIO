import * as THREE from "three";
import { OrbitControls } from "three";
//import { OrbitControls } from 'three-orbitcontrols-ts';
//console.log(THREE)


  

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var container, stats, controls;
    var camera, scene, renderer;
    var frustumSize = 100;
    var dirLight, dirLightHeper, hemiLight, hemiLightHelper;
    var mixers = [];
    var mix = [];
    
    var  geometry;
    
    var pinkF;
    
    var smallSphere;
    
    //var frame = new THREE.NodeFrame();
    
    var clock = new THREE.Clock();

    init();
    animate();

    function init() {


      container = document.createElement( 'div' );
      document.body.appendChild( container );


      // CAMERA

      camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2000 );
      camera.position.set( -50, 25, -50 );
      camera.rotation.set( 0, 180, 0 );
      camera.up = new THREE.Vector3(0,1,0);
      camera.lookAt(new THREE.Vector3(0,0,0));


        // var aspect = window.innerWidth / window.innerHeight;
        // camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 );
        // camera.position.x = 10;
        // camera.position.y = 50;
        // camera.position.z = 10;
        // camera.rotation.y = 180;
        // camera.rotation.x = 0.25;
        // camera.rotation.z = 0.25;
        


      // CONTROLS
      controls = new THREE.OrbitControls( camera, renderer.domElement );
      // new MapControls( camera, renderer.domElement, {
      //     target: new THREE.Plane(new THREE.Vector3(0,0,1), 0),
      //     minDistance: 2.0,
      //     maxDistance: 20
      // });
      // controls = new MapControls( camera, container );
      // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      // controls.dampingFactor = 0.25;
      // controls.screenSpacePanning = false;
      // controls.minDistance = 50;
      // controls.maxDistance = 350;
      // controls.maxPolarAngle = 0.9 * Math.PI / 2;
      // controls.minPolarAngle = 0.4 * Math.PI / 2;
      
      //Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
      //scene.fog = new THREE.Fog( scene.background, 200, 500 );

      // LIGHTS
      hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 50, 0 );
      scene.add( hemiLight );
      hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      scene.add( hemiLightHelper );
      //

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
      //dirLight.shadow.bias = -0.00001;
      dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
      scene.add( dirLightHeper );

      // SKYDOME
      // var vertexShader = document.getElementById( 'vertexShader' ).textContent;
      // var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
      // var uniforms = {
      //   topColor:    { value: new THREE.Color( 0x0077ff ) },
      //   bottomColor: { value: new THREE.Color( 0xE1F5FE ) },
      //   offset:      { value: -20 },
      //   exponent:    { value: 0.8 }
      // };
      // uniforms.topColor.value.copy( hemiLight.color );
      // scene.fog.color.copy( uniforms.bottomColor.value );
      // var skyGeo = new THREE.SphereBufferGeometry( 1000, 32, 15 );
      // var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
      // var sky = new THREE.Mesh( skyGeo, skyMat );
      // scene.add( sky );

      //Helpers
      var gridHelper = new THREE.GridHelper( 1000, 100 );
      scene.add( gridHelper );

      var axesHelper = new THREE.AxesHelper( 10 );
      scene.add( axesHelper );

      // stats = new Stats();
      // stats.domElement.style.position = 'absolute';
      // stats.domElement.style.top = '0px';
      // stats.domElement.style.height = '50px';
      // container.appendChild( stats.domElement );

      // GROUND
      var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
      var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
      groundMat.color.setHSL( 0.095, 1, 0.75 );
      var ground = new THREE.Mesh( groundGeo, groundMat );
      ground.rotation.x = -Math.PI/2;
      ground.position.y = 0;
      scene.add( ground );
      ground.receiveShadow = true;

      
      
      
      
      
      
      
      
      
      //Entity
      var drawCube = function(x,y,z){
        geometry = new THREE.BoxBufferGeometry( 10, 1, 10 );
        var material = new THREE.MeshPhongMaterial( { color: 0x6c5ce7, flatShading: true } );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = x+5;
        cube.position.z = z+5;
        cube.position.y = y;
        cube.castShadow = true; //default is false
        cube.receiveShadow = true; //default
        scene.add( cube );
      }

      for (var i = 0; i < 50; i++) {
        var x = 10*(parseInt(Math.random()*i+1, 10));
        var y = 0;
        var z = 10*(parseInt(Math.random()*i+1, 10));
        drawCube(x,y,z);
        geometry = '';
      };
      
      
      //Isocahedron
      //geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
      //var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
      //smallSphere = new THREE.Mesh( geometry, material );
      
      //scene.add( smallSphere );
      
      
      //Model
      // var loader = new THREE.GLTFLoader();
      
      // loader.load( 'models/Flamingo.glb', function( gltf ) {
      //   var mesh = gltf.scene.children[ 0 ];
      //   var s = 0.1;
      //   mesh.scale.set( s, s, s );
      //   mesh.position.y = 10;
      //   //mesh.rotation.set(0,(90 * Math.PI / 180),0);
      //   mesh.castShadow = true;
      //   mesh.receiveShadow = true;
      //   scene.add( mesh );
      //   var mixer = new THREE.AnimationMixer( mesh );
      //   mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
      //   mixers.push( mixer );
      //   } 
      // );
      
      
      
      
      

      //Render
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.shadowMap.enabled = true;
      renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
      container.appendChild( renderer.domElement );

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.shadowMap.enabled = true

      window.addEventListener( 'resize', onWindowResize, false );
      document.addEventListener( 'keydown', onKeyDown, false );
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
      requestAnimationFrame( animate );
        
      
      var delta = clock.getDelta();
      var timer = Date.now() * 0.01;
      
      //console.log(mixers[0]._root.position);
       
       
       
      if(mixers[0]){
        var speed = 0.155;
        mixers[0]._root.position.set(
          Math.cos( timer * speed ) * 30,
          Math.abs( Math.sin( timer * 0.31 ) ) * 1 + 11,
          Math.sin( timer * speed ) * 30
        );
        //ixers[0]._root.rotation.set = (0,45,0 );
        mixers[0]._root.rotation.y = ( Math.PI*2  ) - timer * speed;
        
      }
      
      //pinkF.rotation.y = ( Math.PI / 2 ) - timer * 0.1; 
      
      
      
      //smallSphere.position.set(
        //Math.cos( timer * 0.1 ) * 30,
        //Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
        //Math.sin( timer * 0.1 ) * 30
      //);
      
      //smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
      //smallSphere.rotation.z = timer * 0.8;
      
      //frame.update( delta );
      //controls.update();
      render(delta);
      //stats.update();
    }

    function render(delta) {

      for ( var i = 0; i < mixers.length; i ++ ) {
        mixers[ i ].update( delta );
      }
      renderer.render( scene, camera );
    }
    


    function onKeyDown ( event ) {
        switch ( event.keyCode ) {
          case 72: // h
          //console.log("Press key: "+event.keyCode);
          hemiLight.visible = !hemiLight.visible;
          hemiLightHelper.visible = !hemiLightHelper.visible;
          break;
          case 68: // d
          dirLight.visible = !dirLight.visible;
          dirLightHeper.visible = !dirLightHeper.visible;
          break;
        }
    }

const Three = ''
export default Three