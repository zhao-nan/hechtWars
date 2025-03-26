export class Explosion {
    x: number;
    y: number;
    width: number;
    height: number;
    frame: number;
    isOver: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frame = 0;
    }

    update() {
        this.frame += 1;
        if (this.frame >= 300) {
            this.isOver = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const colors = ['red', 'orange', 'yellow', 'white'];
        const duration = 5;
        colors.forEach((color, index) => {
            if (this.frame < (4 - index) * duration) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2,
                     this.width / 5 + (5 - index) * 5, this.height / 5 + (5 - index) * 5,
                      0, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }
}