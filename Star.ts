export class Star {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    size: number;
    speed: number;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, size: number, speed: number) {
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}