import * as THREE from "three";

var camera, scene, renderer;
var geometry, material, mesh, grid;
 
init();
animate();
 
function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
 
    scene = new THREE.Scene();
 
    var size = 1;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    geometry = new THREE.PlaneGeometry( 1, 0.5 );

    grid = new THREE.Mesh( geometry, material );
    grid.rotation.set(0, 0, Math.PI/2);
    scene.add( grid );
 
    renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //document.getElementById('cnv').appendChild( renderer.domElement );

    document.body.appendChild( renderer.domElement );
 
    window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
}
 
function animate() {
 
    requestAnimationFrame( animate );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
 
    renderer.render( scene, camera );
 
}

const Three = '';
export default Three;