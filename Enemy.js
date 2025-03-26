import { Explosion } from './Explosion.js';
import { enemies, explosions } from './hecht.js';
export class Enemy {
    constructor(x, y) {
        this.lastShotTime = 0;
        this.lastSpawnTime = 0;
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
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.drawLifeBar(ctx);
    }
    drawLifeBar(ctx) {
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
    die() {
        enemies.splice(enemies.indexOf(this), 1);
        const explosion = new Explosion(this.x, this.y, this.width, this.height);
        explosions.push(explosion);
    }
    isCollidingWith(player) {
        return this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y;
    }
    isHitBy(bullet) {
        return this.x < bullet.x + bullet.radius &&
            this.x + this.width > bullet.x &&
            this.y < bullet.y + bullet.radius &&
            this.y + this.height > bullet.y;
    }
}
//# sourceMappingURL=Enemy.js.map