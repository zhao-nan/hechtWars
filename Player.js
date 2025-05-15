import { Bullet } from './Bullet.js';
import { GameObjectType, rareObjectTypes, specialObjectTypes } from './GameObject.js';
import { canvas, explosions, objects, enemies, bullets, flashEnergyBar } from './hecht.js';
import { Explosion } from './Explosion.js';
export class Player {
    constructor() {
        this.x = 50;
        this.y = canvas.height / 2 + 25;
        this.width = 60;
        this.height = 35;
        this.speed = 5;
        this.isGrabbing = false;
        this.lastShotTime = 0;
        this.lastDiscTime = 0;
        this.lastSpecialTime = Date.now();
        this.lives = 2;
        this.inventory = [];
        this.specials = [];
        this.canGrab = false;
        this.boom = 1;
        this.dakka = 1;
        this.shields = 0;
        this.shieldFlash = false;
        this.damageFlash = false;
        this.beamFlash = false;
        this.isShooting = false;
        this.energy = 10;
        this.invincible = false;
        this.autofire = false;
    }
    reset() {
        this.x = 50;
        this.y = canvas.height / 2 + 25;
        this.lives = 2;
        this.inventory = [];
        this.specials = [];
        this.boom = 1;
        this.dakka = 1;
        this.shields = 0;
        this.energy = 10;
        this.invincible = false;
    }
    moveUp() {
        this.y -= this.speed;
        if (this.y < 20)
            this.y = 20;
    }
    moveDown() {
        this.y += this.speed;
        if (this.y + this.height > canvas.height - 10)
            this.y = canvas.height - this.height - 10;
    }
    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime >= 1000 / this.dakka) {
            bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2, 4 + (this.boom + 6) / 2, 2 + this.dakka, 0, true, false, this.boom));
            this.lastShotTime = currentTime;
            this.isShooting = true;
            setTimeout(() => this.isShooting = false, 100);
        }
    }
    throwDisc() {
        const currentTime = Date.now();
        if (currentTime - this.lastDiscTime >= 1000) {
            if (this.inventory.some(item => item.type === GameObjectType.DISC)) {
                bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2, 20, 5 + (this.energy / 10), 0, true, true, 25 + this.energy));
                const discIndex = this.inventory.findIndex(item => item.type === GameObjectType.DISC);
                if (discIndex !== -1) {
                    this.inventory.splice(discIndex, 1);
                }
                this.getEnergy(-10);
                this.lastDiscTime = currentTime;
                this.isShooting = true;
                setTimeout(() => this.isShooting = false, 200);
            }
        }
    }
    grab() {
        this.isGrabbing = true;
    }
    release() {
        this.isGrabbing = false;
    }
    addToInventory(obj) {
        if (rareObjectTypes.some(t => t === obj.type)) {
            this.inventory.push(obj);
            this.getEnergy(75);
        }
        else if (specialObjectTypes.some(t => t === obj.type)) {
            this.specials.push(obj);
        }
        else {
            switch (obj.type) {
                case GameObjectType.SCHNAPPS:
                    if (this.lives < 5) {
                        this.lives += 1;
                        this.getEnergy(5);
                    }
                    else {
                        this.getEnergy(20);
                    }
                    break;
                case GameObjectType.BLASTER:
                    this.boom += 1;
                    break;
                case GameObjectType.SPEEDUP:
                    this.dakka += 1.5 / 10;
                    break;
                case GameObjectType.SHIELD:
                    this.shields += 1;
                    break;
                case GameObjectType.DISC:
                    this.inventory.push(obj);
                    break;
            }
        }
    }
    activateSpecial(i) {
        if (Date.now() - this.lastSpecialTime < 1000)
            return;
        if (i >= this.specials.length)
            return;
        const special = this.specials[i];
        switch (special.type) {
            case GameObjectType.SHIELDUP:
                this.shields = 10;
                this.getEnergy(50);
                this.shieldFlash = true;
                setTimeout(() => this.shieldFlash = false, 200);
                break;
            case GameObjectType.LIFE:
                this.getEnergy(100);
                this.lives = 5;
                break;
            case GameObjectType.BEAM:
                // Trigger a flash effect
                if (this.energy < 50) {
                    flashEnergyBar();
                    return;
                }
                this.beamFlash = true;
                setTimeout(() => this.beamFlash = false, 1000); // Flash lasts for 1 second
                // Perform the beam animation and damage
                enemies.forEach(enemy => {
                    if (Math.abs(enemy.y + enemy.height / 2 - (this.y + this.height / 2)) <= 100) {
                        enemy.takeDamage(this.boom + 200); // Apply damage
                    }
                });
                this.getEnergy(-20);
                this.createBeamEffect();
                break;
            case GameObjectType.INVINCIBLE:
                this.invincible = true;
                setTimeout(() => this.invincible = false, 20000);
                break;
            case GameObjectType.SPRAY:
                if (this.energy < 50) {
                    flashEnergyBar();
                    return;
                }
                for (let i = 0; i < 40; i++) {
                    bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2, 9, Math.random() * 4 + 4, Math.random() * 4 - 2, true, false, this.boom + 5));
                }
                this.getEnergy(-50);
                break;
        }
        this.lastSpecialTime = Date.now();
        this.specials.splice(i, 1);
    }
    createBeamEffect() {
        const beam = document.createElement('div');
        beam.style.position = 'absolute';
        // Get the canvas's position on the page
        const canvas = document.getElementById('gameCanvas');
        if (!canvas)
            return;
        const canvasRect = canvas.getBoundingClientRect();
        // Adjust the beam's position to start in front of the player
        beam.style.left = `${canvasRect.left + this.x + this.width}px`; // Start at the player's right edge
        beam.style.top = `${canvasRect.top + this.y + this.height / 2 - 5}px`; // Center the beam vertically on the player
        beam.style.width = '1000px'; // Length of the beam
        beam.style.height = '10px'; // Thickness of the beam
        beam.style.backgroundColor = '#00BFFF';
        beam.style.boxShadow = '0 0 20px 5px #00BFFF';
        beam.style.zIndex = '10';
        document.body.appendChild(beam);
        // Remove the beam after the animation
        setTimeout(() => {
            document.body.removeChild(beam);
        }, 500); // Beam lasts for 1 second
    }
    isHitBy(bullet) {
        return this.x < bullet.x + bullet.radius &&
            this.x + this.width > bullet.x &&
            this.y < bullet.y + bullet.radius &&
            this.y + this.height > bullet.y;
    }
    loseLife(l) {
        if (this.invincible)
            return;
        this.lives -= l;
        this.damageFlash = true;
        setTimeout(() => this.damageFlash = false, 200);
        if (this.lives <= 0) {
            explosions.push(new Explosion(this.x, this.y, this.width, this.height));
        }
    }
    update() {
        // Check for collisions with enemies
        enemies.forEach(enemy => {
            if (enemy.isCollidingWith(this)) {
                enemy.collide();
            }
        });
        // Grab objects
        this.canGrab = false;
        objects.forEach(obj => {
            if (obj.isCloseEnough(this)) {
                this.canGrab = true;
            }
            if (obj.isCloseEnough(this) && this.isGrabbing) {
                this.addToInventory(obj);
                objects.splice(objects.indexOf(obj), 1);
            }
        });
    }
    draw(ctx) {
        const hechtImage = new Image();
        hechtImage.src = this.isGrabbing ? 'img/hecht-grab.png' : 'img/hecht.png';
        if (this.isShooting) {
            hechtImage.src = 'img/hecht-shoot.png';
        }
        if (this.damageFlash) {
            hechtImage.src = 'img/hecht-dmg.png';
        }
        if (this.invincible) {
            hechtImage.src = 'img/hecht-invincible.png';
        }
        if (this.beamFlash) {
            hechtImage.src = 'img/hecht-beam.png';
        }
        ctx.drawImage(hechtImage, this.x, this.y, this.width, this.height);
        // Draw shield
        for (let i = 0; i < this.shields; i++) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10 + 3 * i, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(50, 50, ${i * 50})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        // Draw shield flash
        if (this.shieldFlash) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, 2 * Math.PI);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    getEnergy(x) {
        this.energy += x;
        if (this.energy > 100)
            this.energy = 100;
        if (this.energy < 0)
            this.energy = 0;
    }
    toggleAutofire() {
        this.autofire = !this.autofire;
    }
}
//# sourceMappingURL=Player.js.map