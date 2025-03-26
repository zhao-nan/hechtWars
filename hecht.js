import { GameObject, GameObjectType, rareObjectTypes, normalObjectTypes } from './GameObject.js';
import { Player } from './Player.js';
import { Stormtrooper } from './Stormtrooper.js';
import { Tiefighter } from './Tiefighter.js';
import { StarDest } from './StarDest.js';
import { Vader } from './Vader.js';
import { Star } from './Star.js';
console.log('May the pike be with you!');
// Initialize the canvas and context
export const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
export const player = new Player(canvas, 50, canvas.height / 2 - 25, 60, 35, 5);
let lastSDSpawnTime = 0;
let lastSTSpawnTime = 0;
let lastTieSpawnTime = 0;
let lastObjectSpawnTime = 0;
let gameStartTime = Date.now();
let gameOver = false;
let gameStarted = false;
// Function to display the start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const hechtImage = new Image();
    hechtImage.src = 'img/hecht.png';
    hechtImage.onload = () => {
        ctx.drawImage(hechtImage, canvas.width / 2 - 150, 50, 300, 150);
    };
    ctx.font = 'bold 50px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HECHT WARS', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px serif';
    ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height - 50);
}
// Event listener to start the game
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        gameLoop();
    }
});
// Initialize stars
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star(canvas, Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, Math.random() * 2 + 1));
}
export const explosions = [];
// Initialize enemies
export const enemies = [];
// Initialize objects
export const objects = [];
function spawnObject() {
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 55) + 25;
    let type;
    let availableNormalTypes = normalObjectTypes;
    if (player.lives == 5)
        availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.SCHNAPPS);
    if (player.shields == 5)
        availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.SHIELD);
    if (player.inventory.filter(item => item.type === GameObjectType.DISC).length > 10)
        availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.DISC);
    const random = Math.random();
    if (random < 0.1) {
        const availableRareTypes = rareObjectTypes.filter(t => !player.inventory.some(item => item.type === t) &&
            !objects.some(obj => obj.type === t));
        if (availableRareTypes.length > 0) {
            type = availableRareTypes[Math.floor(Math.random() * availableRareTypes.length)];
        }
        else {
            type = availableNormalTypes[Math.floor(Math.random() * availableNormalTypes.length)];
        }
    }
    else {
        type = availableNormalTypes[Math.floor(Math.random() * availableNormalTypes.length)];
    }
    objects.push(new GameObject(x, y, type));
}
function update() {
    if (player.lives <= 0) {
        gameEnd(false);
    }
    stars.forEach(star => star.update());
    explosions.forEach(explosion => explosion.update());
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (explosions[i].isOver) {
            explosions.splice(i, 1);
        }
    }
    if (keysPressed.has('ArrowUp')) {
        player.moveUp();
    }
    if (keysPressed.has('ArrowDown')) {
        player.moveDown();
    }
    if (keysPressed.has(' ')) {
        player.shoot();
    }
    // Check for grabbing objects
    if (keysPressed.has('Enter')) {
        player.grab();
    }
    else {
        player.release();
    }
    if (keysPressed.has('d')) {
        player.throwDisc();
    }
    player.update();
    spawn();
    // Move objects and enemies
    objects.forEach(obj => obj.update());
    // Catch your Disc!
    const outObj = objects.filter(obj => obj.isOutOfScreen());
    if (outObj.some(obj => obj.type === GameObjectType.DISC)) {
        player.loseLife(1);
    }
    for (let i = objects.length - 1; i >= 0; i--) {
        if (objects[i].isOutOfScreen()) {
            objects.splice(i, 1);
        }
    }
    enemies.forEach(enemy => enemy.update());
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].x + enemies[i].width < 0) {
            enemies[i].escape();
            enemies.splice(i, 1);
        }
    }
}
function spawn() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - gameStartTime;
    const strength = elapsedTime / 60000;
    if (!enemies.some(e => e instanceof Vader)) {
        if (currentTime - lastSTSpawnTime >= 5000 + Math.random() * 5000) {
            enemies.push(new Stormtrooper(canvas.width, Math.random() * (canvas.height - 50), strength));
            lastSTSpawnTime = currentTime;
        }
        if (elapsedTime > 60000 && currentTime - lastTieSpawnTime >= 5000 + Math.random() * 5000) {
            enemies.push(new Tiefighter(canvas.width, Math.random() * (canvas.height - 50)));
            lastTieSpawnTime = currentTime;
        }
        if (elapsedTime > 120000 && currentTime - lastSDSpawnTime >= 5000 + Math.random() * 5000) {
            enemies.push(new StarDest(canvas.width, Math.random() * (canvas.height - 100), strength));
            lastSDSpawnTime = currentTime;
        }
        if (elapsedTime > 240000
            && !enemies.some(e => e instanceof Vader)
            && player.inventory.some(item => item.type === GameObjectType.LEIA)
            && player.inventory.some(item => item.type === GameObjectType.SABER)
            && player.inventory.some(item => item.type === GameObjectType.R2D2)
            && player.inventory.some(item => item.type === GameObjectType.YODA)
            && player.points > 10000) {
            enemies.push(new Vader(canvas.width, Math.random() * (canvas.height - 100)));
        }
    }
    if (currentTime - lastObjectSpawnTime >= 5000 + Math.random() * 5000) {
        spawnObject();
        lastObjectSpawnTime = currentTime;
    }
}
// Draw game objects
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => star.draw(ctx));
    explosions.forEach(explosion => explosion.draw(ctx));
    player.draw(ctx);
    // Draw objects
    objects.forEach(o => o.draw(ctx));
    // Draw enemies
    enemies.forEach(e => e.draw(ctx));
    // Draw status bar
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const offset = 20;
    if (player.lives > 0)
        ctx.fillText("❤️ ".repeat(player.lives), offset, 20);
    ctx.fillText(`Points: ${player.points}`, offset + 150, 20);
    player.inventory.forEach((item, index) => {
        ctx.drawImage(item.image, offset + 300 + index * 40, 5, 30, 30);
    });
    // Draw audio icon
    const audioIcon = new Image();
    audioIcon.onload = () => {
        ctx.drawImage(audioIcon, canvas.width - 40, 10, 300, 300);
    };
}
// Set to store currently pressed keys
const keysPressed = new Set();
// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    keysPressed.add(e.key);
});
window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.key);
});
export function gameEnd(win) {
    gameOver = true;
    let opacity = 0;
    const message = win ? 'SCHNAPP! Darth Vader ist besiegt!' : 'Game Over :(';
    const addMessage = win ? 'May we meet on May the 10th :)' : '';
    const fadeDuration = 3000; // 2 seconds
    const fadeStep = 50; // milliseconds
    const fadeIncrement = fadeStep / fadeDuration;
    let fadeInterval = setInterval(fade, fadeStep);
    function fade() {
        opacity += fadeIncrement;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (opacity >= 1) {
            opacity = 1;
            clearInterval(fadeInterval);
            fadeInterval = null;
            drawEndScreen();
        }
    }
    function drawEndScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const hechtImage = new Image();
        hechtImage.src = win ? 'img/hecht.png' : 'img/hecht-dmg.png';
        hechtImage.onload = () => {
            ctx.drawImage(hechtImage, canvas.width / 2 - 150, 50, 300, 150);
        };
        ctx.font = 'bold 50px serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        ctx.font = 'bold 50px serif';
        ctx.fillText(addMessage, canvas.width / 2, canvas.height / 2 + 75);
        ctx.font = '20px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height - 50);
        document.addEventListener('keydown', restartGame);
    }
    function restartGame(event) {
        if (event.key === 'r' || event.key === 'R') {
            document.removeEventListener('keydown', restartGame);
            // Reset game state and restart the game loop
            resetGame();
            requestAnimationFrame(gameLoop);
        }
    }
}
document.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }
});
function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = 50;
    player.y = canvas.height / 2 - 25;
    player.lives = 3;
    player.points = 0;
    player.inventory = [];
    player.canGrab = false;
    player.boom = 1;
    player.dakka = 1;
    player.bullets = [];
    gameStartTime = Date.now();
    //clear enemies and objects
    enemies.length = 0;
    objects.length = 0;
    gameOver = false;
}
// Main game loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}
// Start the game loop
drawStartScreen();
//# sourceMappingURL=hecht.js.map