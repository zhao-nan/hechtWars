import { Bullet } from './Bullet.js';
import { canvas, enemies, player, explosions, gameEnd, bullets } from './hecht.js';
import { Stormtrooper } from './Stormtrooper.js';
import { Tiefighter } from './Tiefighter.js';
import { Explosion } from './Explosion.js';
import { Enemy } from './Enemy.js';

export class Vader extends Enemy {

    numOfWaves: number = 0;

    constructor(x: number, y: number) {
        super(x, y);
        this.lives = 1000;
        this.initLives = this.lives;
        this.speed = 0.1;
        this.width = 100;
        this.height = 100;
        this.image.src = 'img/vader.png';
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > Math.random() * 1000 + 2000) {
            const bullet = new Bullet(this.x - 6, this.y + this.height / 2, 10,
                 Math.random()*(-10) - 4, 0, false, false, 3);
            bullets.push(bullet);
            this.lastShotTime = now;
        }
    }

    special() {
        const now = Date.now();
        if (now - this.lastSpawnTime > Math.random() * 10000 + 5000) {
            let rand = Math.random();
            for (let i = 0; i < Math.floor(rand * 22) + 3; i++) {
                if (rand >= 0.5) {
                    enemies.push(new Stormtrooper(canvas.width, Math.random() * canvas.height - 50, 5 + this.numOfWaves));
                } else {
                    enemies.push(new Tiefighter(canvas.width, Math.random() * canvas.height - 50));
                }
            }
            this.lastSpawnTime = now;
        }
    }

    changeDirection() {
        let rand = Math.floor(Math.random() * 3);
        if (rand == 0 && this.y < canvas.height - this.height && this.yspeed < 2) {    
            this.yspeed += 0.05;
        } else if (rand == 1 && this.y > 25 && this.yspeed > -2) {
            this.yspeed -= 0.05;
        }
        if (this.y > canvas.height - this.height) {
            this.yspeed = -0.1;
        }
        if (this.y < 25) {
            this.yspeed = 0.1;
        }
        this.y += this.yspeed;
    }
    
    escape() {return;}

    die () {
        super.die();
        explosions.push(new Explosion(this.x, this.y, this.width + 50, this.height + 50));
        explosions.push(new Explosion(this.x + 50, this.y + 50, this.width, this.height));
        explosions.push(new Explosion(this.x - 50, this.y + 50, this.width, this.height));
        explosions.push(new Explosion(this.x + 50, this.y - 50, this.width, this.height));
        explosions.push(new Explosion(this.x - 50, this.y - 50, this.width, this.height));
        gameEnd(true);
    }

    collide() {
        player.loseLife(5);
    }
    
}