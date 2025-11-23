// THREE.js Background Animation

const canvas = document.getElementById("bgCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(40, 40, 40);
scene.add(point);

// NODE STORAGE
let nodes = [];
let lines = [];
let NODE_COUNT = 50;

// Random Color Function
function randomColor() {
  const hue = Math.random() * 360;
  return new THREE.Color(`hsl(${hue}, 70%, 60%)`);
}

// CREATE A NODE
function createNode() {
  const geo = new THREE.SphereGeometry(0.6, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: randomColor(),
    emissive: randomColor(),
    metalness: 0.3,
    roughness: 0.4,
  });

  const node = new THREE.Mesh(geo, mat);
  node.position.set(
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 60
  );

  scene.add(node);
  nodes.push(node);

  // Connect to other nodes randomly
  nodes.forEach((other) => {
    if (other !== node && Math.random() < 0.07) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        node.position,
        other.position,
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0x00bcd4,
        transparent: true,
        opacity: 0.15,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);

      lines.push({ line, p1: node, p2: other });
    }
  });
}

// INITIAL NODES
for (let i = 0; i < NODE_COUNT; i++) createNode();

// MOUSE MOVE EFFECT
let mouse = new THREE.Vector2(0, 0);
document.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  camera.position.x = 40 * Math.sin(Date.now() * 0.0002);
  camera.position.z = 40 * Math.cos(Date.now() * 0.0002);
  camera.lookAt(0, 0, 0);

  nodes.forEach((n) => {
    n.rotation.x += 0.004;
    n.rotation.y += 0.008;
  });

  lines.forEach((l) => {
    l.line.geometry.setFromPoints([l.p1.position, l.p2.position]);
  });

  renderer.render(scene, camera);
}

animate();

// RESIZE FIX
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
/* background three.js code omitted for brevity */
