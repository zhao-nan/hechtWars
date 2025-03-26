import {Bullet} from './Bullet.js';
import {Player} from './Player.js';
import {Explosion} from './Explosion.js';
import {enemies, explosions} from './hecht.js';

export abstract class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    yspeed: number;
    initLives: number;
    lives: number;
    image: HTMLImageElement;
    lastShotTime: number = 0;
    lastSpawnTime: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.yspeed = 0;
        this.lastShotTime = Date.now();
        this.lastSpawnTime = Date.now();
        this.image = new Image();
    }

    update() {
        this.x -= this.speed;

        this.shoot();

        this.special();

        this.changeDirection();        
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.drawLifeBar(ctx);
    }

    drawLifeBar(ctx: CanvasRenderingContext2D) {
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x;
        const barY = this.y + this.height + 2; // Position the bar below the enemy

        // Draw the background of the life bar
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Draw the foreground of the life bar
        const lifePercentage = this.lives / this.initLives;
        ctx.fillStyle = 'green';
        ctx.fillRect(barX, barY, barWidth * lifePercentage, barHeight);
    }

    abstract special();

    abstract shoot();

    abstract changeDirection();

    abstract collide();

    abstract escape();

    die() {
        enemies.splice(enemies.indexOf(this), 1);
        const explosion = new Explosion(this.x, this.y, this.width, this.height);
        explosions.push(explosion);
    }

    isCollidingWith(player: Player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }

    isHitBy(bullet: Bullet) {
        return this.x < bullet.x + bullet.radius &&
               this.x + this.width > bullet.x &&
               this.y < bullet.y + bullet.radius &&
               this.y + this.height > bullet.y;
    }
}
