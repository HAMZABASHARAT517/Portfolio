console.log("script.js loaded");

const canvas = document.getElementById("bgCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(40, 40, 40);
scene.add(point);

let nodes = [];
let lines = [];
const NODE_COUNT = 60;

function randomColor() {
  const hue = Math.random() * 360;
  return new THREE.Color('hsl(' + hue + ', 70%, 60%)');
}

function createNode() {
  const geo = new THREE.SphereGeometry(0.6, 12, 12);
  const mat = new THREE.MeshStandardMaterial({
    color: randomColor(),
    emissive: randomColor(),
    metalness: 0.2,
    roughness: 0.4,
  });
  const node = new THREE.Mesh(geo, mat);
  node.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*40, (Math.random()-0.5)*60);
  scene.add(node);
  nodes.push(node);

  nodes.forEach(other => {
    if(other !== node && Math.random() < 0.06) {
      const geometry = new THREE.BufferGeometry().setFromPoints([node.position, other.position]);
      const material = new THREE.LineBasicMaterial({ color: 0x00bcd4, transparent:true, opacity:0.12 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      lines.push({ line, p1: node, p2: other });
    }
  });
}

for(let i=0;i<NODE_COUNT;i++) createNode();

let mouse = new THREE.Vector2(0,0);
document.addEventListener('mousemove', (e)=> {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  camera.position.x = 40 * Math.sin(Date.now() * 0.0002);
  camera.position.z = 40 * Math.cos(Date.now() * 0.0002);
  camera.lookAt(0,0,0);
  nodes.forEach(n => {
    n.rotation.x += 0.003;
    n.rotation.y += 0.006;
    n.position.x += (mouse.x) * 0.2 * (Math.random()-0.5);
    n.position.y += (mouse.y) * 0.2 * (Math.random()-0.5);
  });
  lines.forEach(l => {
    l.line.geometry.setFromPoints([l.p1.position, l.p2.position]);
    l.line.material.opacity = 0.08 + 0.08 * Math.sin(Date.now()*0.002);
  });
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', ()=> {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
