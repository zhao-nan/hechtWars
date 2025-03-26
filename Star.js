export class Star {
    constructor(canvas, x, y, size, speed) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = this.canvas.width;
            this.y = Math.random() * this.canvas.height;
        }
    }
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}
//# sourceMappingURL=Star.js.map