import { Bullet } from './Bullet.js';
import { GameObject, GameObjectType, rareObjectTypes} from './GameObject.js';
import { canvas, explosions, objects, enemies} from './hecht.js';
import { Explosion } from './Explosion.js';


export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    bullets: Bullet[];
    isGrabbing: boolean;
    lastShotTime: number;
    lastDiscTime: number;
    lives: number;
    inventory: GameObject[];
    canGrab: boolean;
    boom: number;
    dakka: number;
    shields: number;
    shieldFlash: boolean;
    damageFlash: boolean;
    isShooting: boolean;
    energy: number;

    constructor() {
        this.x = 50;
        this.y = canvas.height / 2 + 25;
        this.width = 60;
        this.height = 35;
        this.speed = 5;
        this.bullets = [];
        this.isGrabbing = false;
        this.lastShotTime = 0;
        this.lastDiscTime = 0;
        this.lives = 2;
        this.inventory = [];
        this.canGrab = false;
        this.boom = 1;
        this.dakka = 1;
        this.shields = 0;
        this.shieldFlash = false;
        this.damageFlash = false;
        this.isShooting = false;
        this.energy = 10;
    }

    moveUp() {
        this.y -= this.speed;
        if (this.y < 20) this.y = 20;
    }

    moveDown() {
        this.y += this.speed;
        if (this.y + this.height > canvas.height - 10) this.y = canvas.height - this.height - 10;
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime >= 1000 / this.dakka) {
            this.bullets.push(
                new Bullet(this.x + this.width, this.y + this.height / 2,
                    (this.boom + 8)/2, 2 + this.dakka, true, false, this.boom));
            this.lastShotTime = currentTime;
            this.isShooting = true;
            setTimeout(() => this.isShooting = false, 100);
        }
    }

    throwDisc() {
        const currentTime = Date.now();
        if (currentTime - this.lastDiscTime >= 1000) {
            if (this.inventory.some(item => item.type === GameObjectType.DISC)) {
                this.bullets.push(
                    new Bullet(this.x + this.width, this.y + this.height / 2
                        , 20, 5 + (this.energy / 10), true, true, 25 + this.energy));
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

    addToInventory(obj: GameObject) {
        if (rareObjectTypes.some(t => t === obj.type)) {
            this.inventory.push(obj);
        } else {
            switch (obj.type) {
                case GameObjectType.SCHNAPPS:
                    if (this.lives < 5) {
                        this.lives += 1;
                        this.getEnergy(5);
                    } else {
                        this.getEnergy(10);
                    }
                    break;
                case GameObjectType.BLASTER:
                    this.boom += 1;
                    break;
                case GameObjectType.SPEEDUP:
                    this.dakka += 2/10;
                    break;
                case GameObjectType.SHIELD:
                    if (this.shields < 5) this.shields += 1;
                    break;
                case GameObjectType.DISC:
                    this.inventory.push(obj);
                    break;
            }
        }
        this.inventory.sort((a, b) => {
            if (a.type === GameObjectType.DISC) return 1;
            if (b.type === GameObjectType.DISC) return -1;
            return a.type - b.type;
        });
    }
    isHitBy(bullet: Bullet) {
        return this.x < bullet.x + bullet.radius &&
               this.x + this.width > bullet.x &&
               this.y < bullet.y + bullet.radius &&
               this.y + this.height > bullet.y;
    }

    loseLife(l: number) {
        this.lives -= l;
        this.damageFlash = true;
        setTimeout(() => this.damageFlash = false, 200);
        if (this.lives <= 0) {
            explosions.push(new Explosion(this.x, this.y, this.width, this.height));
        }
    }

    update() {
        // Update bullets
        this.bullets.forEach(bullet => {
            bullet.x += bullet.speed;
        });

        // Remove bullets that are off-screen
        this.bullets = this.bullets.filter(bullet => bullet.x < canvas.width);
        // Check for collisions with enemies
        enemies.forEach(enemy => {
            if (enemy.isCollidingWith(this)) {
                enemy.collide();
            }
            enemy.bullets.forEach(bullet => {
                if (this.isHitBy(bullet)) {
                    if (this.shields > 0) {
                        this.shields = Math.max(0, this.shields - bullet.damage);
                        this.shieldFlash = true;
                        setTimeout(() => this.shieldFlash = false, 100);
                    } else {
                        this.loseLife(bullet.damage);
                    }
                    enemy.bullets.splice(enemy.bullets.indexOf(bullet), 1);
                }
            });
            this.bullets.forEach(bullet => {
                if (enemy.isHitBy(bullet)) {
                    enemy.lives -= bullet.damage;
                    if (enemy.lives <= 0) {
                        enemy.die();
                    }
                    // Remove bullet
                    this.bullets.splice(this.bullets.indexOf(bullet), 1);
                }
            });
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

    draw(ctx: CanvasRenderingContext2D) {
        const hechtImage = new Image();
        hechtImage.src = this.isGrabbing ?'img/hecht-grab.png' : 'img/hecht.png';
        if (this.isShooting) {
            hechtImage.src = 'img/hecht-shoot.png';
        }
        if (this.damageFlash) {
            hechtImage.src = 'img/hecht-dmg.png';
        }
        ctx.drawImage(hechtImage, this.x, this.y, this.width, this.height);

        // Draw shield
        for (let i = 0; i < this.shields; i++) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10+3*i, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(50, 50, ${i * 50})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        this.bullets.forEach(bullet => bullet.draw(ctx)); 

        // Draw shield flash
        if (this.shieldFlash) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, 2 * Math.PI);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    getEnergy(x: number) {
        this.energy += x;
        if (this.energy > 100) this.energy = 100;
        if (this.energy < 0) this.energy = 0;
    }
}
