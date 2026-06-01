// Инициализация Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Настройка камеры
camera.position.set(0, 5, 20);
camera.lookAt(0, 0, 0);

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Создание земли (сетка из кубов)
const blockSize = 1;
const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

// Разные типы блоков
const materials = [
    new THREE.MeshBasicMaterial({ color: 0x8B4513 }), // Земля
    new THREE.MeshBasicMaterial({ color: 0x228B22 }), // Трава
    new THREE.MeshBasicMaterial({ color: 0xA0A0A0 })  // Камень
];

// Создаём плоский мир 20x20
for (let x = -10; x < 10; x++) {
    for (let z = -10; z < 10; z++) {
        const block = new THREE.Mesh(geometry, materials[1]); // Трава сверху
        block.position.set(x * blockSize, 0, z * blockSize);
        scene.add(block);
    }
}

// Управление камерой (вид от первого лица)
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 0.2;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'a': moveLeft = true; break;
        case 'd': moveRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w': moveForward = false; break;
        case 's': moveBackward = false; break;
        case 'a': moveLeft = false; break;
        case 'd': moveRight = false; break;
    }
});

// Вращение камеры мышью
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.002;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.002;
});

// Установка/удаление блоков
const blocks = [];

document.addEventListener('click', (event) => {
    const materialIndex = Math.floor(Math.random() * materials.length);
    const newBlock = new THREE.Mesh(geometry, materials[materialIndex]);
    
    // Упрощённое позиционирование — ставим рядом с камерой
    newBlock.position.copy(camera.position);
    newBlock.position.x += Math.sin(camera.rotation.y) * 3;
    newBlock.position.z += Math.cos(camera.rotation.y) * 3;
    newBlock.position.y = 1; // На высоте 1
    
    scene.add(newBlock);
    blocks.push(newBlock);
});

// Удаление блока при ПКМ
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (blocks.length > 0) {
        const lastBlock = blocks.pop();
        scene.remove(lastBlock);
    }
});

// Анимация и обновление позиции
function animate() {
    requestAnimationFrame(animate);

    // Движение игрока
    if (moveForward) camera.position.z -= speed;
    if (moveBackward) camera.position.z += speed;
    if (moveLeft) camera.position.x -= speed;
    if (moveRight) camera.position.x += speed;

    // Вращение камеры
    camera.rotation.y += mouseX;
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x - mouseY));

    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
