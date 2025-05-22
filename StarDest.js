import { Enemy } from './Enemy.js';
import { Bullet } from './Bullet.js';
import { canvas, explosions, player, bullets, objects } from './hecht.js';
import { Explosion } from './Explosion.js';
import { GameObject, specialObjectTypes } from './GameObject.js';
export class StarDest extends Enemy {
    constructor(x, y, strength) {
        super(x, y);
        this.hasSpecial = true;
        this.cooldown = 0;
        this.lives = Math.floor(Math.random() * 50) + 25 + 20 * strength;
        this.initLives = this.lives;
        this.speed = 2;
        this.width = 100;
        this.height = 100;
        this.image.src = 'img/star-destroyer.png';
        this.initTime = Date.now();
        this.cooldown = Math.random() * 10000;
    }
    static spawn(strength, x, y) {
        const ix = (x) || canvas.width;
        const iy = (y) || Math.random() * (canvas.height - 100);
        const is = (strength) || Math.floor(Math.random() * 5) + 2;
        return new StarDest(ix, iy, is);
    }
    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > Math.random() * 5000 + 2000) {
            explosions.push(new Explosion(this.x - 30, this.y + this.height / 2, 1, 1));
            const bullet = new Bullet(this.x - 20, this.y + this.height / 2, 15, -4, 0, false, false, 3);
            bullets.push(bullet);
            this.lastShotTime = now;
        }
    }
    special() {
        const now = Date.now();
        if (now - this.initTime > this.cooldown && this.hasSpecial) {
            this.hasSpecial = false;
            explosions.push(new Explosion(this.x - 100, this.y, 100, 100));
            for (let i = 0; i < 10; i++) {
                const bullet = new Bullet(this.x - 5, this.y + this.height / 2, 9, Math.random() * (-4) - 4, Math.random() * (3) - 1.5, false, false, 1);
                bullets.push(bullet);
            }
        }
    }
    changeDirection() { return; }
    collide() {
        player.loseLife(4);
        this.die();
    }
    die() {
        super.die();
        explosions.push(new Explosion(this.x, this.y, 200, 200));
        explosions.push(new Explosion(this.x + Math.random() * 100 - 50, this.y + Math.random() * 100 - 50, 100, 100));
        // maybe drop a special
        if (player.specials.length < 5 && Math.random() < 0.5) {
            const availableSpecialTypes = specialObjectTypes.filter(t => !player.specials.some(item => item.type === t) &&
                !objects.some(obj => obj.type === t));
            const type = availableSpecialTypes[Math.floor(Math.random() * availableSpecialTypes.length)];
            objects.push(new GameObject(this.x, this.y, type));
        }
    }
    escape() { return; }
}
//# sourceMappingURL=StarDest.js.map