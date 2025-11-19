// Scene setup
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000,1);

// Nodes
const nodeCount = 120;
const nodes = [];
const nodeMaterial = new THREE.MeshBasicMaterial({color:0x00d4ff});
const geometry = new THREE.SphereGeometry(0.12,10,10);
for(let i=0;i<nodeCount;i++){
  let node = new THREE.Mesh(geometry,nodeMaterial);
  node.position.set((Math.random()-0.5)*25,(Math.random()-0.5)*15-5,(Math.random()-0.5)*25);
  node.userData.velocity = new THREE.Vector3();
  scene.add(node);
  nodes.push(node);
}

// Lines
const lines = new THREE.Group();
scene.add(lines);

// Trails
const trailCount = 150;
const trails = [];
const trailMat = new THREE.PointsMaterial({color:0x00ffff,size:0.05,transparent:true,opacity:0.8});
for(let i=0;i<trailCount;i++){
  trails.push(new THREE.Vector3(Math.random()*30-15,Math.random()*20-10,Math.random()*30-15));
}
const trailGeom = new THREE.BufferGeometry().setFromPoints(trails);
const trailPoints = new THREE.Points(trailGeom, trailMat);
scene.add(trailPoints);

camera.position.z = 20;
camera.position.y = -2;

const mouse = new THREE.Vector2();
document.addEventListener('mousemove', e=>{
  mouse.x = (e.clientX/window.innerWidth)*2-1;
  mouse.y = -(e.clientY/window.innerHeight)*2+1;
});

document.addEventListener('click', ()=>{
  nodes.forEach(node=>{
    const force = new THREE.Vector3((Math.random()-0.5)*3,(Math.random()-0.5)*3,(Math.random()-0.5)*3);
    node.userData.velocity.copy(force);
  });
});

function animate(){
  requestAnimationFrame(animate);

  camera.position.x += (mouse.x*10 - camera.position.x)*0.05;
  camera.position.y += (mouse.y*10 - camera.position.y)*0.05 -2;
  camera.lookAt(scene.position);
  scene.rotation.y += 0.001;

  lines.clear();

  nodes.forEach(node=>{
    node.position.add(node.userData.velocity);
    node.userData.velocity.multiplyScalar(0.92);
    if(node.userData.velocity.length()<0.01) node.userData.velocity.set(0,0,0);
  });

  for(let i=0;i<nodeCount;i++){
    for(let j=i+1;j<nodeCount;j++){
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if(dist<3){
        const opacity = 1 - dist/3;
        const mat = new THREE.LineBasicMaterial({color:0x00ffff,opacity:opacity,transparent:true});
        const geom = new THREE.BufferGeometry().setFromPoints([nodes[i].position,nodes[j].position]);
        lines.add(new THREE.Line(geom,mat));
      }
    }
  }

  trails.forEach(p=>{
    p.x += (Math.random()-0.5)*0.1;
    p.y += (Math.random()-0.5)*0.1;
    p.z += (Math.random()-0.5)*0.1;
  });
  trailGeom.setFromPoints(trails);

  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
