import { enemies, bullets, player } from "./hecht.js";

export class Bullet {
    x: number;
    y: number;
    radius: number;
    xspeed: number;
    yspeed: number;
    friendly: boolean;
    disc: boolean;
    damage: number;

    constructor(x: number, y: number, radius: number,
          xspeed: number, yspeed:number, friendly: boolean, disc: boolean, damage: number = 1) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.friendly = friendly;
        this.disc = disc;
        this.damage = damage;
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;

        enemies.forEach(enemy => {
            if (enemy.isHitBy(this)) {
                enemy.lives -= this.damage;
                if (enemy.lives <= 0) {
                    enemy.die();
                }
                // Remove bullet
                bullets.splice(bullets.indexOf(this), 1);
            }
        });
        if (player.isHitBy(this)) {
            if (player.shields > 0) {
                player.shields = Math.max(0, player.shields - this.damage);
                player.shieldFlash = true;
                setTimeout(() => player.shieldFlash = false, 100);
            } else {
                player.loseLife(this.damage);
            }
            bullets.splice(bullets.indexOf(this), 1);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.disc) {
            let img = new Image();
            img.src = 'img/disc.png';
            ctx.drawImage(img, this.x, this.y, this.radius, this.radius);
        } else {
            ctx.fillStyle = this.friendly ? 'teal' : 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}