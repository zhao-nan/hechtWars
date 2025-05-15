import { GameObject, GameObjectType, rareObjectTypes, normalObjectTypes} from './GameObject.js';
import { Player } from './Player.js';
import { Enemy} from './Enemy.js';
import { Stormtrooper } from './Stormtrooper.js';
import { Tiefighter } from './Tiefighter.js';
import { StarDest } from './StarDest.js';
import { Vader } from './Vader.js';
import { Star } from './Star.js';
import { Explosion } from './Explosion.js';
import { Bullet } from './Bullet.js';

console.log('May the pike be with you!');

// Initialize the canvas and context
export const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export const player = new Player();
let lastSDSpawnTime = 0;
let lastSTSpawnTime = 0;
let lastTieSpawnTime = 0;
let lastObjectSpawnTime = 0;
let gameStartTime = Date.now();
let gameOver = false;
let gameStarted = false;
let tieStart = Math.random() * 20000 + 50000;
let sdStart = Math.random() * 40000 + 100000;
let vaderSpawnTime = Math.random() * 120000 + 200000;
let aKeyLocked = false;

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
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        gameLoop();
    }
});


// Initialize stars
const stars: Star[] = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star(canvas, Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, Math.random() * 2 + 1));
}

export const explosions: Explosion[] = [];

// Initialize enemies
export const enemies: Enemy[] = [];

export const bullets: Bullet[] = [];

// Initialize objects
export const objects: GameObject[] = [];
function spawnObject() {
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 55) + 25;
    let type: GameObjectType;
    let availableNormalTypes = normalObjectTypes;
    if (player.lives >= 5 && player.energy >= 80) availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.SCHNAPPS);
    if (player.shields >= 5) availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.SHIELD);
    if (player.inventory.filter(item => item.type === GameObjectType.DISC).length > 10) availableNormalTypes = availableNormalTypes.filter(t => t !== GameObjectType.DISC);
    const random = Math.random();
    const elapsedTime = Date.now() - gameStartTime;
    const rareThreshold = elapsedTime / vaderSpawnTime;
    if (random < 0.2 * rareThreshold) {
        const availableRareTypes = rareObjectTypes.filter(t => 
            !player.inventory.some(item => item.type === t) && 
            !objects.some(obj => obj.type === t)
        );
        if (availableRareTypes.length > 0) {
            type = availableRareTypes[Math.floor(Math.random() * availableRareTypes.length)];
        } else {
            type = availableNormalTypes[Math.floor(Math.random() * availableNormalTypes.length)];
        }
    } else {
        type = availableNormalTypes[Math.floor(Math.random() * availableNormalTypes.length)];
    }
    objects.push(new GameObject(x, y, type));
}

function drawEnergyBar(ctx: CanvasRenderingContext2D, player: Player) {
    const energyBar = document.getElementById('energy-bar');
    const energyHeight = player.energy; // Percentage

    if (energyBar) {
        energyBar.style.height = `${energyHeight}%`;
    }
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

    playerInput();

    player.update();

    spawn();

    // Draw energy bar
    drawEnergyBar(ctx, player);
    
    // Move objects and enemies
    objects.forEach(obj => obj.update());

    bullets.forEach(bullet => bullet.update());

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

    updateStatusBar();
}

function playerInput() {
    if (keysPressed.has('ArrowUp')) {
        player.moveUp();
    }
    if (keysPressed.has('ArrowDown')) {
        player.moveDown();
    }
    if (player.autofire || keysPressed.has(' ')) {
        player.shoot();
    }
    // Check for grabbing objects
    if (keysPressed.has('Enter')) {
        player.grab();
    } else {
        player.release();
    }
    if (keysPressed.has('d')) {
        player.throwDisc();
    }
    if (keysPressed.has('a') && !aKeyLocked) {
        player.toggleAutofire();
        aKeyLocked = true;
        setTimeout(() => {
            aKeyLocked = false;
        }, 500);
    }
    // if a number key is pressed, use the corresponding item
    for (let i = 1; i <= 5; i++) {
        if (keysPressed.has(i.toString())) {
            player.activateSpecial(i - 1);
        }
    }
}

function spawn() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - gameStartTime;
    const strength = Math.floor(elapsedTime / 60000);

    if (!enemies.some(e => e instanceof Vader)) {
        if (currentTime - lastSTSpawnTime >= 5000 + Math.random() * 5000) {
            enemies.push(new Stormtrooper(canvas.width, Math.random() * (canvas.height - 50), strength));
            lastSTSpawnTime = currentTime;
        }
        if (elapsedTime > tieStart && currentTime - lastTieSpawnTime >= 5000 + Math.random() * 5000) {
            enemies.push(new Tiefighter(canvas.width, Math.random() * (canvas.height - 25)));
            lastTieSpawnTime = currentTime;
        }
        if (elapsedTime > sdStart && currentTime - lastSDSpawnTime >= 8000 + Math.random() * 5000) {
            enemies.push(new StarDest(canvas.width, Math.random() * (canvas.height - 100), strength));
            lastSDSpawnTime = currentTime;
        }
        if (elapsedTime > vaderSpawnTime
                && player.inventory.some(item => item.type === GameObjectType.LEIA)
                && player.inventory.some(item => item.type === GameObjectType.SABER)
                && player.inventory.some(item => item.type === GameObjectType.R2D2)
                && player.inventory.some(item => item.type === GameObjectType.YODA)) {
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

    bullets.forEach(bullet => bullet.draw(ctx));

    player.draw(ctx);

    // Draw objects
    objects.forEach(o => o.draw(ctx));

    // Draw enemies
    enemies.forEach(e => e.draw(ctx));
    

}

function updateStatusBar() {
    const livesBar = document.getElementById('lives-bar');
    if (livesBar) {
        if (player.lives > 0) {
            const redHearts = "❤️  ".repeat(player.lives);
            const blackHearts = "🖤  ".repeat(5 - player.lives);
            livesBar.textContent = redHearts + blackHearts;
        }
    }

    const discContainer = document.getElementById('disc-container');
    if (discContainer) {
        const discCount = player.inventory.filter(item => item.type === GameObjectType.DISC).length;
        discContainer.innerHTML = '';
        for (let i = 0; i < discCount; i++) {
            const discImage = document.createElement('img');
            discImage.src = 'img/disc.png';
            discImage.style.width = '30px';
            discImage.style.height = '30px';
            discContainer.appendChild(discImage);
        }
    }

    const raresContainer = document.getElementById('rares-container');
    if (raresContainer) {
        raresContainer.innerHTML = '';
        player.inventory.filter(item => rareObjectTypes.includes(item.type)).forEach(item => {
            const rareImage = document.createElement('img');
            rareImage.src = item.image.src;
            rareImage.style.width = item.width.toString() + 'px';
            rareImage.style.height = item.height.toString() + 'px';
            raresContainer.appendChild(rareImage);
        });
    }

    const specialContainer = document.getElementById('special-container');
    if (specialContainer) {
        specialContainer.innerHTML = '';
        player.specials.forEach(item => {
            const specialImage = document.createElement('img');
            specialImage.src = item.image.src;
            specialImage.style.width = item.width.toString() + 'px';
            specialImage.style.height = item.height.toString() + 'px';
            specialContainer.appendChild(specialImage);
        });
    }
}

export function flashEnergyBar() {
    const energyBar = document.getElementById('energy-bar');
    const col = '#A5FF81';
    if (energyBar) {
        energyBar.style.backgroundColor = 'red';
        setTimeout(() => energyBar.style.backgroundColor = col, 200);
    }
}
 
// Set to store currently pressed keys
const keysPressed = new Set<string>();

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    keysPressed.add(e.key);
});

window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.key);
});

export function gameEnd(win: boolean) {
    gameOver = true;
    let opacity = 0;
    const message = win ? 'SCHNAPP! Darth Vader ist besiegt!' : 'Game Over :(';
    const addMessage = win ? 'May we meet on May the 10th :)': '';
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

    function restartGame(event: KeyboardEvent) {
        if (event.key === 'r' || event.key === 'R') {
            document.removeEventListener('keydown', restartGame);
            // Reset game state and restart the game loop
            resetGame();
            requestAnimationFrame(gameLoop);        
        }
    }
}
document.addEventListener('keydown', function(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }
});

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.reset();

    gameStartTime = Date.now();
    enemies.length = 0;
    objects.length = 0;
    bullets.length = 0;
    explosions.length = 0;
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