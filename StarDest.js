import { Enemy } from './Enemy.js';
import { Bullet } from './Bullet.js';
import { player } from './hecht.js';
export class StarDest extends Enemy {
    constructor(x, y, strength) {
        super(x, y);
        this.lives = Math.floor(Math.random() * 50) + 25 + 20 * strength;
        this.initLives = this.lives;
        this.speed = 2;
        this.width = 100;
        this.height = 100;
        this.image.src = 'img/star-destroyer.png';
    }
    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > Math.random() * 5000 + 2000) {
            const bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, -4, false, false, 3);
            this.bullets.push(bullet);
            this.lastShotTime = now;
        }
    }
    special() { return; }
    changeDirection() { return; }
    collide() {
        player.loseLife(4);
        this.die();
    }
    escape() { return; }
}
//# sourceMappingURL=StarDest.js.map