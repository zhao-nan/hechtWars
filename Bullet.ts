export class Bullet {
    x: number;
    y: number;
    radius: number;
    speed: number;
    friendly: boolean;
    disc: boolean;
    damage: number;

    constructor(x: number, y: number, radius: number,
          speed: number, friendly: boolean, disc: boolean, damage: number = 1) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.friendly = friendly;
        this.disc = disc;
        this.damage = damage;
    }

    update() {
        this.x += this.speed;
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