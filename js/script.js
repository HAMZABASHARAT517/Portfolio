// Scene Setup
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 15;
camera.position.y = 0;

// Renderer
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000,1);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00d4ff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 3D Model - Torus
const torusGeo = new THREE.TorusGeometry(3, 1, 16, 100);
const torusMat = new THREE.MeshStandardMaterial({color:0x00d4ff, roughness:0.5, metalness:0.7});
const torus = new THREE.Mesh(torusGeo, torusMat);
torus.position.y = -2; // slightly down
scene.add(torus);

// Nodes
const nodeCount = 80;
const nodes = [];
const nodeMat = new THREE.MeshStandardMaterial({color:0x00ffff});
const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);

for(let i=0;i<nodeCount;i++){
  const node = new THREE.Mesh(nodeGeo, nodeMat);
  node.position.set((Math.random()-0.5)*25,(Math.random()-0.5)*15-5,(Math.random()-0.5)*25);
  node.userData.velocity = new THREE.Vector3();
  scene.add(node);
  nodes.push(node);
}

// Lines Group
const linesGroup = new THREE.Group();
scene.add(linesGroup);

// Mouse
const mouse = new THREE.Vector2();
document.addEventListener('mousemove', e=>{
  mouse.x = (e.clientX/window.innerWidth)*2-1;
  mouse.y = -(e.clientY/window.innerHeight)*2+1;
});

// Animate
function animate(){
  requestAnimationFrame(animate);

  // Rotate Torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  // Move nodes
  nodes.forEach(node=>{
    node.position.add(node.userData.velocity);
    node.userData.velocity.multiplyScalar(0.92);
    if(node.userData.velocity.length()<0.01) node.userData.velocity.set(0,0,0);
  });

  // Connect nodes
  linesGroup.clear();
  for(let i=0;i<nodeCount;i++){
    for(let j=i+1;j<nodeCount;j++){
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if(dist<3){
        const opacity = 1 - dist/3;
        const mat = new THREE.LineBasicMaterial({color:0x00ffff,opacity:opacity,transparent:true});
        const geom = new THREE.BufferGeometry().setFromPoints([nodes[i].position,nodes[j].position]);
        linesGroup.add(new THREE.Line(geom,mat));
      }
    }
  }

  // Camera follows mouse
  camera.position.x += (mouse.x*10 - camera.position.x)*0.05;
  camera.position.y += (mouse.y*10 - camera.position.y)*0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
