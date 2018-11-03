import React, { Component } from "react"
import * as THREE from "three";
import MapControls from "./controls/MapControls";
//import GLTFLoader from 'three-gltf-loader';
//import FBXLoader from "./examples/js/loaders/FBXLoader";
import FBXLoader from 'three-fbx-loader'

import W from "../wrapper/W"



import GLTFLoader from 'three-gltf-loader';
 



      // envmap
        let path = 'textures/cube/Bridge2/';
        let format = '.jpg';
        let envMap = new THREE.CubeTextureLoader().load( [
          path + 'posx' + format, path + 'negx' + format,
          path + 'posy' + format, path + 'negy' + format,
          path + 'posz' + format, path + 'negz' + format
        ] );
        const scene = new THREE.Scene();
        //scene.background = envMap;
        let light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
        light.position.set( 0, 1, 0 );
        scene.add( light );













class Tetra extends Component {
    constructor(props) {
        super(props);
        const scene = new THREE.Scene();
        const camera =  new THREE.PerspectiveCamera( 70, 240 / 135, 0.01, 2000 ) ;

        camera.layers.enable( 2 );

        const renderer = new THREE.WebGLRenderer({alpha: false, antialias: true });
        
        
        let loader = new GLTFLoader();
        let mixers = []              
        // loader.load( 'models/gltf/Flamingo.glb', function ( gltf ) {
        //     var mesh = gltf.scene.children[ 0 ];
        //     var s = 0.35;
        //     mesh.scale.set( s, s, s );
        //     mesh.position.y = 15;
        //     mesh.rotation.y = - 1;
        //     mesh.castShadow = true;
        //     mesh.receiveShadow = true;
        //     scene.add( mesh );
        //     var mixer = new THREE.AnimationMixer( mesh );
        //     mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        //     mixers.push( mixer );
        // } );
        loader.load( 'models/gltf/Samba Dancing.glb', function ( gltf ) {
            var mesh = gltf.scene.children[ 0 ];
            var s = 0.24;
            mesh.scale.set( s, s, s );
            mesh.position.y = 0;
            mesh.rotation.y = - 1;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add( mesh );
            var mixer = new THREE.AnimationMixer( mesh );
            mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
            mixers.push( mixer );
        } );



//---HELM


        // loader.load( 'models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', function ( gltf ) {
        //   gltf.scene.traverse( function ( child ) {
        //     if ( child.isMesh ) {
        //       child.material.envMap = envMap;
        //     }
        //   } );

        //   scene.add( gltf.scene );
        // }, undefined, function ( e ) {
        //   console.error( e );
        // } );


        // const loader = new FBXLoader();
        // const fbx = [];

        // // loader.load( 'models/mixamo.fbx', function ( model ) {
        // //     const mixer = new THREE.AnimationMixer(model);
        // //     mixer.clipAction(model.animations[0]).play();
        // //     scene.add( model );
        // //     fbx.push({model, mixer});
            
        // // } );

        // this.fbx = fbx;

        this.state = {
            scene: scene,
            camera: camera,
            renderer: renderer,
            clientWidth: 240,
            clientHeight: 135,
            mouse: {
                x:0,
                y:0
            },
            position: { 
                x:0, 
                y:0
            },
            hexSize: 8,
            hexOrigin: {
                x: 0,
                y:0
            },
            round: 5,

            cd: 0x3498db
        };

        this.clock = new THREE.Clock();

        this.state.scene.background = new THREE.Color().set('#795548');
        this.state.scene.fog = new THREE.Fog( this.state.scene.background, 200, 500 );

        this.state.height = this.state.hexSize*2;
        this.state.vert = this.state.height * 3/4;
        this.state.width = Math.sqrt(3)/2 * this.state.height;
        this.state.horiz = this.state.width;



        this.GeometryCell = new THREE.CylinderBufferGeometry( 
            this.state.hexSize*0.95, 
            this.state.hexSize*0.95, 
            1.618, 
            6 
        );


        //this.GeometryCell.dynamic = true;

        this.MeshPhongMaterial = new THREE.MeshPhongMaterial( { 
            color: this.state.cd, 
            emissive: 0x001200, 
            flatShading: true 
        } );


        this.BufferGeometry = new THREE.BufferGeometry();


        this.mixers = mixers

        this.draw = 0

    }



    componentDidMount() {
        const ScreenSize = { 
            width : this.container.clientWidth,
            height : this.container.clientHeight
        }

        this.setScreenSize(ScreenSize)
        // let bgr = {...this.state.scene}
        // bgr.background = new THREE.Color().set('#795548');
        // this.setState({bgr})

        //let fg = {...this.state.scene}
        //fg.fog = new THREE.Fog( this.state.scene.background, 200, 500 );
        //this.setState({fg})
        //this.state.scene.fog = new THREE.Fog( this.state.scene.background, 200, 500 );

        let scp = {...this.state.camera}
        scp.position = scp.position.set( 50, 75, 50)
        this.setState({scp})

        this.controls = new MapControls( this.state.camera, this.container );
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 350;
        this.controls.maxPolarAngle = 0.9 * Math.PI / 2;
        this.controls.minPolarAngle = 0.4 * Math.PI / 2;
        this.state.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // LIGHTS
        this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
        this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        this.hemiLight.position.set( 0, 50, 0 );
        this.state.scene.add( this.hemiLight );
        this.hemiLightHelper = new THREE.HemisphereLightHelper( this.hemiLight, 10 );
        this.state.scene.add( this.hemiLightHelper );

        this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        this.dirLight.color.setHSL( 0.1, 1, 0.95 );
        this.dirLight.position.set( -2, 1.75, 1 );
        this.dirLight.position.multiplyScalar( 30 );
        this.state.scene.add( this.dirLight );
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 4096;
        this.dirLight.shadow.mapSize.height = 4096;
        this.shadowDistance = 200;
        this.dirLight.shadow.camera.left = -this.shadowDistance;
        this.dirLight.shadow.camera.right = this.shadowDistance;
        this.dirLight.shadow.camera.top = this.shadowDistance;
        this.dirLight.shadow.camera.bottom = -this.shadowDistance;
        this.dirLight.shadow.camera.far = 3500;
        this.dirLight.shadow.bias = -0.00001;
        this.dirLightHeper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.state.scene.add( this.dirLightHeper );
        
        // SKYDOME
        this.vertexShader = document.getElementById( 'vertexShader' ).textContent;
        this.fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
        this.uniforms = {
            topColor:    { value: new THREE.Color( 0x0077ff ) },
            bottomColor: { value: new THREE.Color( 0xE1F5FE ) },
            offset:      { value: -20 },
            exponent:    { value: 0.8 }
        };
        this.uniforms.topColor.value.copy( this.hemiLight.color );
        this.state.scene.fog.color.copy( this.uniforms.bottomColor.value );
        this.skyGeo = new THREE.SphereBufferGeometry( 1000, 32, 15 );
        this.skyMat = new THREE.ShaderMaterial( { vertexShader: this.vertexShader, fragmentShader: this.fragmentShader, uniforms: this.uniforms, side: THREE.BackSide } );
        this.sky = new THREE.Mesh( this.skyGeo, this.skyMat );
        this.sky.name = 'SKYDOME';
        this.state.scene.add( this.sky );

        // Helpers
        this.gridHelper = new THREE.GridHelper( 1000, 20 );
        this.state.scene.add( this.gridHelper );

        // GROUND
        this.geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
        this.material = new THREE.MeshPhongMaterial( { color: 0x03A9F4, specular: 0x050505 } );
        this.material.color.set('#795548');
        this.ground = new THREE.Mesh( this.geometry, this.material );
        this.ground.name = 'GROUND';
        this.ground.rotation.x = -Math.PI/2;
        this.ground.position.y = 0;
        this.ground.receiveShadow = true;
        this.state.scene.add( this.ground );
        
        // Icosahedron
        this.geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
        this.material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
        this.tetraGeo = new THREE.Mesh( this.geometry, this.material );
        this.tetraGeo.name = 'Icosahedron';
        this.tetraGeo.castShadow = true;
        this.state.scene.add( this.tetraGeo )

        this.cellGroup = new THREE.Object3D();
        this.cellGroup.name = 'Map'
        this.state.scene.add( this.cellGroup );


        this.state.renderer.setPixelRatio( window.devicePixelRatio );
        this.state.renderer.gammaInput = true;
        this.state.renderer.gammaOutput = true;
        this.state.renderer.shadowMap.enabled = true;

        this.container.appendChild(this.state.renderer.domElement)
    
        window.addEventListener("resize", this.updateScreenSize.bind(this))
        window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false);
        this.updateScreenSize();



        this.raycaster = new THREE.Raycaster();



        this.start()

    }

    roundDown = () => {
        // this.setState({
        //     round:2
        // })
        this.drawKnight()
    }    

    roundUp = () => {
        // this.setState({
        //     round:8
        // })
        this.drawCell()
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.round !== nextState.round) {
    //         return true;
    //     }

    //     return false;
    // }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateScreenSize.bind(this))
        this.stop()
        this.container.removeChild(this.state.renderer.domElement)
    }


    onMouseMove( event ) {
        event.preventDefault();
        let off = this.findRelativeCanvasOffset()

        var mouse = new THREE.Vector2();

        mouse.x = ( (event.clientX-off.x )/ this.container.clientWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY-off.y) /  this.container.clientHeight ) * 2 + 1;

        this.setState({mouse:mouse}) 
        //this.mouse =  mouse

        //console.log(this.state.mouse)
         //console.log(this.mouse)
    }

    findRelativeCanvasOffset = () => {
        var x = 0;
        var y = 0;
        var layoutEl = document.getElementById('screen');
        if (layoutEl.offsetParent) {
            do {
                x += layoutEl.offsetLeft;
                y += layoutEl.offsetTop;
            } while (layoutEl = layoutEl.offsetParent);
            return {x:x,y:y}
        }
    }

    updateScreenSize() {      
        let up_w = this.container.clientWidth-4;
        let up_h = this.container.clientHeight-4;
        this.state.camera.aspect = up_w / up_h;
        this.state.camera.updateProjectionMatrix();
        this.setState({ clientWidth: up_w })
        this.setState({ clientHeight: up_h })
        this.state.renderer.setSize( up_w, up_h )
    }

    drawKnight = () => {

    }

    drawCell = () => {

        // var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );


        // const cellPoints = this.drawHex(this.Point(0,0))

        // //var shape = new THREE.Shape(cellPoints);
        // //shape.autoClose = true;
        // var geometry = new THREE.Geometry().setFromPoints( cellPoints )
        // geometry.autoClose = true;
        // var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "yellow"}));
        // line.lookAt(new THREE.Vector3(0, 1, 0));
        // this.cellShape = line;
        // this.cellShape.name = 'Cell'
        // //this.cellGroup.add(this.cellShape)

        // this.state.scene.add( this.cellShape );


        



        
        this.instancePosition = [];
        
        var cd = { r: 155/255, g: 89/255, b: 182/255}

        


        this.drawGrid(this.Point(0,0),1,cd);



        // var loader = new GLTFLoader();
        // loader.load( 'models/gltf/Flamingo.glb', function( gltf ) {
        //     var mesh = gltf.scene.children[ 0 ];
        //     var s = 0.35;
        //     mesh.scale.set( s, s, s );
        //     mesh.position.y = 15;
        //     mesh.rotation.y = -1;
        //     mesh.castShadow = true;
        //     mesh.receiveShadow = true;
        //     this.state.scene.add( mesh );
        //     var mixer = new THREE.AnimationMixer( mesh );
        //     mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        //     this.mixers.push( mixer );
        // } );



        //this.Mesh.geometry.needsUpdate = true;
        // this.drawGrid(this.Point(this.state.vert/2+0.628,this.state.horiz*6.09),1,cd);
        // this.drawGrid(this.Point(this.state.vert*6.36,this.state.horiz*2.61),1,cd);
        //this.drawGrid(this.Point(0,0),1,cd);
        //this.drawField(this.Point(0,0),2)



        // this.raycaster = new THREE.Raycaster();



        // var geometry = new THREE.BufferGeometry();

        // geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );
        // var material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );
        // this.line = new THREE.Line( geometry, material );
        // this.state.scene.add( this.line );

        // var geo = new THREE.ExtrudeBufferGeometry( shape, {
        //     depth: 1,
        //     bevelEnabled: false
        // } );


        // const mat = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
        
        // var mesh = new THREE.Mesh( geo, mat );
        // mesh.lookAt(new THREE.Vector3(0, 1, 0));

        //this.state.shape = line;
        //this.state.scene.add( mesh );
        //console.log(shape)
    }

    // addUnit () {
    //     const geo = new THREE.IcosahedronBufferGeometry( 5, 0 );
    //     const mat = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
    //     const obj = new THREE.Mesh( geo, mat );
    //     //obj.castShadow = true; //default is false
    //     this.state.scene.add( obj );
    // }

    
    Point = (x, y) => {
        return {x: x, y: y}
    }

    Hex = function(q, r){
        return {q: q, r: r}
    }

    Cube = function(x, y, z){
        return {x: x, y: y, z: z}
    }

    hex_corner =  function (center, i) {
        var angle_deg = 60*i+30;
        var angle_rad = Math.PI/180*angle_deg;
        var x = center.x + this.state.hexSize * Math.cos(angle_rad);
        var y = center.y + this.state.hexSize * Math.sin(angle_rad);
        return this.Point(x, y)
    }


    hexToPixel = function (h){
        //console.log(this.state.hexOrigin)
        var hexOrigin = this.state.hexOrigin;
        var x = this.state.hexSize * Math.sqrt(3) * (h.q + h.r/2) + hexOrigin.x;
        var y = this.state.hexSize * 3/2 * h.r + hexOrigin.y;
        return this.Point(x, y)
    };

    pixelToHex = function (p){
        var q = ((p.x - this.state.hexOrigin.x) * Math.sqrt(3)/3 - (p.y - this.state.hexOrigin.y)/ 3) / this.state.hexSize;
        var r = (p.y - this.state.hexOrigin.y) * 2/3 / this.state.hexSize;
        return this.hexRound(this.Hex(q, r))
    };


    cubeDir = function (dir){
        var cubeDir = [ this.Cube(-1, 1, 0), this.Cube(0, 1, -1), this.Cube(1, 0, -1), this.Cube(1, -1, 0), this.Cube(0, -1, 1), this.Cube(-1, 0, 1) ];
        return cubeDir[dir];
    }

    cubeAdd = function (a, b){
        return this.Cube(a.x + b.x, a.y + b.y, a.z + b.z)
    }

    cubeNeighbor = function (c, dir){
        return this.cubeAdd(c, this.cubeDir(dir))
    }

    cubeToAxial = function (c){
        var q = c.x;
        var r = c.z;
        //console.log(q, r);
        return this.Hex(q, r)
    };

    axialToCube = function (h){
        var x = h.q;
        var z = h.r;
        var y = -x-z;
        //console.log(x, y, z);
        return this.Cube(x, y, z)
    };

    cube_to_oddr = function (c){
        var q = c.x - (c.z - (c.z&1)) / 2;
        var r = c.z;
        //console.log(q, r);
        return this.Hex(q, r)
    };

    oddr_to_cube = function (h){
        var x = h.q + (h.r - (h.r&1)) / 2;
        var z = h.r;
        var y = -x-z;
        //console.log(x, y, z);
        return this.Cube(x, y, z)
    };

    hexRound = function (h){
        return this.cubeRound(this.axialToCube(h))
    };

    cubeRound = function (c){
        var rx = Math.round(c.x);
        var ry = Math.round(c.y);
        var rz = Math.round(c.z);

        var x_diff = Math.abs(rx - c.x);
        var y_diff = Math.abs(ry - c.y);
        var z_diff = Math.abs(rz - c.z);

        if (x_diff > y_diff && x_diff > z_diff){
            rx = -ry-rz;
        } else if (y_diff > z_diff){
            ry = -rx-rz;
        } else {
            rz = -rx-ry;
        }
        
        if(rx === -0){
            rx = 0;
        }
        if(ry === -0){
            ry = 0;
        }
        if(rz === -0){
            rz = 0;
        }
        return this.Cube(rx, ry, rz)
    };

    cubeDir = function (dir){
        var cubeDir = [ this.Cube(-1, 1, 0), this.Cube(0, 1, -1), this.Cube(1, 0, -1), this.Cube(1, -1, 0), this.Cube(0, -1, 1), this.Cube(-1, 0, 1) ];
        return cubeDir[dir];
    }

    cubeAdd = function (a, b){
        return this.Cube(a.x + b.x, a.y + b.y, a.z + b.z)
    }

    cubeNeighbor = function (c, dir){
        return this.cubeAdd(c, this.cubeDir(dir))
    }

    findNeighbors = function(c){
        //console.log("Finding Neighbours:");
        for(var i=0; i<6; i++){
            var cube = this.cubeNeighbor(this.Cube(c.x, c.y, c.z), i)
            //console.log(cube);
            //draw neighbours start//
            var hex = this.cubeToAxial(cube);
            var center = this.hexToPixel(hex);
            //this.fillHex(center, "yellow");
            //this.drawHex(center);
            //draw neighbours end//
        }
    }

    cubeDistance = function (a, b){
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
    };

    lerp = function (a, b, t) {
        return a + (b - a) * t
    }

    lerpCube = function (a, b, t){
        return this.Cube(this.lerp(a.x, b.x, t), this.lerp(a.y, b.y, t), this.lerp(a.z, b.z, t))
    }

    drawLineCube = function(a, b){
        var N = this.cubeDistance(a, b);
        var results = [];
        for(var i =0; i<= N; i++){
            results.push(this.cubeRound(this.lerpCube(a, b, 1.0/N * i)));
        }
        return results
    }


    getHexParameters = function(){
        var hexHeight = this.state.hexSize * 2;
        var hexWidth = Math.sqrt(3)/2 * hexHeight;
        var vertDist = hexHeight * 3/4;
        var horizDist = hexWidth;
        return {hexWidth: hexWidth, hexHeight: hexHeight, vertDist: vertDist, horizDist: horizDist}
        
    };

    drawHexCoord = function (center,h){
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = "ccc";
        this.ctx.fillText("q:"+h.q, center.x - this.state.hexSize/2, center.y + this.state.hexSize/15);
        this.ctx.fillText("r:"+h.r, center.x + this.state.hexSize/4, center.y + this.state.hexSize/15);
    };

    drawCubeCoord = function (center,c){
        console.log('Cube coord: ')
        console.log(c)
        console.log('Center point: ')
        console.log(center)
        // this.ctx.globalAlpha = 0.5;
        // this.ctx.fillStyle = "red";
        // this.ctx.fillText("x:"+c.x, center.x - this.state.hexSize/1.4, center.y - this.state.hexSize/4);
        // this.ctx.fillStyle = "green";
        // this.ctx.fillText("y:"+c.y, center.x + this.state.hexSize/3, center.y - this.state.hexSize/4);
        // this.ctx.fillStyle = "blue";
        // this.ctx.fillText("z:"+c.z, center.x - this.state.hexSize/4, center.y + this.state.hexSize/1.4);
        // this.ctx.fillStyle = "black";
    };


    drawHex = (center) => {
        let cellPoints = []
        for(var i=0; i<=5; i++){
            var start = this.hex_corner(center, i);
            //var end = this.hex_corner(center, i + 1);
            cellPoints.push(new THREE.Vector2 (start.x, start.y));
        }

        return cellPoints
    }

    drawField = (center) => {
        for(var i=0; i<=5; i++){
            var start = this.hex_corner(center, i);
            start.x = start.x *15
            start.y = start.y *15
            console.log(start)
            this.drawGrid(start)
            //var end = this.hex_corner(center, i + 1);
        }
    }

    fillHex = function(center, fillColor){
        var c0 = this.hex_corner(center, 0);
        var c1 = this.hex_corner(center, 1);
        var c2 = this.hex_corner(center, 2);
        var c3 = this.hex_corner(center, 3);
        var c4 = this.hex_corner(center, 4);
        var c5 = this.hex_corner(center, 5);
        this.state.ctx.beginPath();
        this.state.ctx.fillStyle = fillColor;
        
        this.state.ctx.moveTo(c0.x, c0.y);
        this.state.ctx.lineTo(c1.x, c1.y);
        this.state.ctx.lineTo(c2.x, c2.y);
        this.state.ctx.lineTo(c3.x, c3.y);
        this.state.ctx.lineTo(c4.x, c4.y);
        this.state.ctx.lineTo(c5.x, c5.y);
        this.state.ctx.closePath();
        this.state.ctx.fill();
    };

    drawGrid = function(offset,type,cd){
        var slash = this.state.round;
        for(var r=-(slash); r<=(slash); r++){
            for(var q=-(slash); q<=(slash);q++){
                var cube = this.axialToCube(this.Hex(q, r));
                var hex = this.cube_to_oddr(cube);

                if(this.state.drawType == "cube"){
                    //cube = this.oddr_to_cube(hex);
                    //hex = this.cubeToAxial(cube);       
                }
                //hex = this.hexRound(cube);
                //cube = this.oddr_to_cube(hex);
                // hex = this.cubeToAxial(cube)

                // cube = this.oddr_to_cube(hex);
                
                //hex = this.cube_to_oddr(cube);
                //cube = this.cubeRound(cube);

                ///Romb offset
                hex = this.cubeToAxial(cube)

                var center = this.hexToPixel(hex);

                center.x += offset.x
                center.y += offset.y


                var geoCell =    new THREE.CylinderBufferGeometry( 
                                this.state.hexSize*0.95, 
                                this.state.hexSize*0.95, 
                                1.618, 
                                6 
                            );



                var cell = new THREE.Mesh( 
                    geoCell,
                    new THREE.MeshPhongMaterial( { 
                        color: this.state.cd, 
                        emissive: 0.618 * 0x000000, 
                        flatShading: true 
                    } )
                    // new THREE.MeshLambertMaterial( 
                    //     { 
                    //         color: 0.618 * 0xffffff 
                    //     } 
                    // ) 
                );
                cell.position.x = center.x
                cell.position.y = Math.abs(cube.y)+Math.abs(cube.x)+Math.abs(cube.z)
                cell.position.z = center.y

                cell.rotation.x = 2 * Math.PI;
                cell.rotation.y = 2 * Math.PI;
                cell.rotation.z = 2 * Math.PI;

                cell.scale.x = 1;
                cell.scale.y = 1;
                cell.scale.z = 1;
                //scene.add( object );

                cell.layers.set(2)
                cell.cubeCoord = cube;
                cell.hexCoord = hex;

                cell.receiveShadow = true;
                cell.castShadow = true;

                cell.name = Math.random()*100;

                this.state.scene.add(cell)


                // var cd = { r: 231/255, g: 76/255, b: 60/255}

                // this.MeshPhongMaterial.color = cd



                // this.Mesh = new THREE.Mesh( this.GeometryCell, this.MeshPhongMaterial );
                // this.Mesh.receiveShadow = true;
                // this.Mesh.castShadow = true;


                // this.Mesh.position.x = (center.x)
                // this.Mesh.position.y = Math.abs(cube.y)+Math.abs(cube.x)+Math.abs(cube.z)
                // this.Mesh.position.z = (center.y)

                // this.Mesh.name = 'x: '+cube.x+' y: '+cube.y+' z: '+cube.z+'';
                // this.Mesh.layers.set(2)

                if(type){

                    //this.state.scene.add( this.Mesh )
                    //this.cellGroup.add( this.Mesh )

                } else {
                    if((cube.x <= slash && cube.y <= slash && cube.z <= slash)){
                        if((cube.x >= -slash && cube.y >= -slash && cube.z >= -slash)){
                
                            //this.state.scene.add( this.Mesh )
                            //this.cellGroup.add( this.Mesh )

                        }
                    
                    }
                }
            }       
        }


        //this.state.scene.cellGroup.update( );

    };

    setCameaAspect = (asp) => {
        this.setState({
            ...this.state.camera,
            aspect: asp,
        })
        console.log(asp)
    }

    setScreenSize = (ss) => {
        this.setState({ 
            clientWidth: ss.width,
            clientHeight: ss.height
        })
    } 

    start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
        //this.drawCell()
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {

        this.frameId = window.requestAnimationFrame(this.animate)
        this.delta = this.clock.getDelta();
        this.timer = Date.now() * 0.01;
        // this.fbx.forEach(({mixer}) => {mixer.update(this.clock.getDelta());});

        // if ( this.mixers.length > 0 ) {
        //     for ( var i = 0; i < this.mixers.length; i ++ ) {
        //         this.mixers[ i ].update( this.clock.getDelta() );
        //     }
        // }

        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( this.delta );
        }



        this.tetraGeo.position.set(
            Math.cos( this.timer * 0.1 ) * 30,
            Math.abs( Math.cos( this.timer * 0.2 ) ) * 20 + 5,
            Math.sin( this.timer * 0.1 ) * 30
        );

        this.tetraGeo.rotation.y = ( Math.PI / 2 ) - this.timer * 0.1;
        this.tetraGeo.rotation.z = this.timer * 0.8;
        //console.log(this.mixers)



       
        this.renderScene(this.delta)
        
        
    }

    renderScene = () => {

        this.raycaster.setFromCamera( this.state.mouse, this.state.camera );

        this.intersects = this.raycaster.intersectObjects( this.state.scene.children );

        if ( this.intersects.length > 0 ) {
            if(this.intersects[ 0 ].object.layers.mask == 4){
                if ( this.INTERSECTED != this.intersects[ 0 ].object ) {

                        if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

                        this.INTERSECTED = this.intersects[ 0 ].object;
                        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                        this.INTERSECTED.material.emissive.setHex( 0x16a085 );
                        //console.log(this.INTERSECTED)
                }
            } else {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                                
                this.INTERSECTED = null;
            }

        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                                
            this.INTERSECTED = null;
        }

        this.state.renderer.render(this.state.scene, this.state.camera)
    }




  render() {
//console.log(this.state.scene)
    return (
        <W>
        <button id="roundUp" className="ml-0" onClick={this.roundUp}>
            RoundUp+
        </button>
        <button id="roundDown" onClick={this.roundDown} >
            roundDown-
        </button>
        <div 
            id="screen" 
            className="Screen" 
            style={{width:"inherit", height:"inherit", position:"absolute"}} 
            ref={thisNode => this.container=thisNode} 
        />
        </W> 
    )
  }

}


export default Tetra;