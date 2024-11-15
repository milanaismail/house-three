import './style.css'
import * as THREE from 'three';
//orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//glb
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

//glb loader
const loader = new GLTFLoader();
loader.load('/car.glb', function(gltf){
  scene.add(gltf.scene);
  gltf.scene.position.y = 0.5;
  gltf.scene.position.x = 5;
}, undefined, function(error){
  console.error(error);
});


const darkGrey = new THREE.Color(0x36454F);
const jetBlack = new THREE.Color(0x343434);
//add orbit controls
const controls = new OrbitControls( camera, renderer.domElement );


//add light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

//add directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
directionalLight.position.set( 0, 1, 1 ).normalize();
scene.add( directionalLight );


//add plane
const planeGeometry = new THREE.PlaneGeometry( 20, 10, 5 );
const planeMaterial = new THREE.MeshBasicMaterial( { color: 0x6B8E23, side: THREE.DoubleSide } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.y = -0.21;
plane.rotation.x = - Math.PI / 2;
scene.add( plane );

const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.BoxGeometry( 4, 1.4, 4 );
const material = new THREE.MeshStandardMaterial( { color: darkGrey,
  side: THREE.DoubleSide } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = 0.5;
scene.add( cube );
function createCloud() {
  const cloud = new THREE.Group();

  // Generate several spheres to form a cloud cluster
  const sphereCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 spheres per cloud
  for (let i = 0; i < sphereCount; i++) {
    const cloudGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 16, 16); // Varying size
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.6,
    });
    
    const sphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
    
    // Position the spheres within the cloud group
    sphere.position.set(
      Math.random() * 1.5 - 0.75, // Random x position within the cloud
      Math.random() * 0.5,        // Random y position within the cloud
      Math.random() * 1.5 - 0.75  // Random z position within the cloud
    );
    
    cloud.add(sphere);
  }
  
  return cloud;
}

// Arrange clouds in a staggered formation
const cloudCount = 10; // Number of clouds
const xSpacing = 4; // Distance between clouds along the X-axis
const yOffset = 1; // Vertical offset increment for each cloud
const zOffset = 2; // Depth offset increment for each cloud

for (let i = 0; i < cloudCount; i++) {
  const cloud = createCloud();
  
  // Stagger clouds along X, Y, and Z
  cloud.position.set(
    i * xSpacing - (cloudCount / 2) * xSpacing, // Staggered along X
    3 + (i % 2) * yOffset,                     // Alternate height with each cloud
    -5 + (i % 3) * zOffset                     // Depth variation
  );

  scene.add(cloud);
}

// create the inner cube (for the picture)
const innerGeometry = new THREE.PlaneGeometry(1, 0.5); // Adjust size as needed
const innerMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load('/me.jpg'), // Replace with your image path

});
const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
innerCube.position.set(0, 0.5, -1.9); // Position it inside the outer cube
scene.add(innerCube);


const doorGeometry = new THREE.PlaneGeometry( 1.2, 0.9 );
const doorMaterial = new THREE.MeshBasicMaterial( { color: jetBlack, side: THREE.DoubleSide } );
const door = new THREE.Mesh( doorGeometry, doorMaterial );
door.position.set(0, 0.25, 2.01); // Slightly offset in z to avoid z-fighting
scene.add( door );


//add 
const baseTexture = textureLoader.load('/roof_base.jpg'); // Base color texture
const roughnessTexture = textureLoader.load('/roof_rough.jpg'); // Roughness map
const coneGeometry = new THREE.ConeGeometry( 2.9, 1, 4); 
const coneMaterial = new THREE.MeshStandardMaterial( 
  {map: baseTexture,
  roughness: roughnessTexture,
  } );
const cone = new THREE.Mesh(coneGeometry, coneMaterial ); 
cone.position.y = 1.7;
cone.rotation.y = Math.PI / 4;
scene.add( cone );

camera.position.z = 6;
camera.position.y = 3;
camera.lookAt(0, 0.5, 0);
let angle = 0; // Initial angle for camera movement
const radius = 6; // Radius of the circular path
const yPosition = 3; // Height of the camera
const stopAngle = Math.PI / 2; // Target angle where the camera should stop (90 degrees)
let animationComplete = false; // Flag to indicate if the animation is complete

function animate() {
  if (!animationComplete) {
    // Update the angle for circular motion until it reaches the stop angle
    if (angle < stopAngle) {
      angle += 0.02; // Adjust the speed of the rotation here
      // Update camera position in a circular path around the object
      camera.position.x = radius * Math.cos(angle);
      camera.position.z = radius * Math.sin(angle);
      camera.position.y = yPosition;

      // Make the camera look at the center of the scene
      camera.lookAt(0, 0.5, 0); // Adjust the lookAt position as needed
    } else {
      animationComplete = true; // Stop animating the camera
    }
  } else {
    // Enable OrbitControls after the animation is complete
    controls.enabled = true;
    controls.update();
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Initial setup to disable controls during the animation
controls.enabled = false;
renderer.setAnimationLoop(animate);