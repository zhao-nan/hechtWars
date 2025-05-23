import { Enemy } from './Enemy.js';
import { canvas, player } from './hecht.js';

export class Stormtrooper extends Enemy {

    constructor(x: number, y: number, strength: number) {
        super(x, y);
        this.lives = Math.floor(Math.random() * 5) + 2 + strength;
        this.speed = Math.random() * 2 + 1;
        this.width = 20 + this.lives * 2;
        this.height = 20 + this.lives * 2;
        this.image.src = 'img/stormtrooper.png';
        this.initLives = this.lives;
    }

    static spawn(strength?: number, x?: number, y?: number) {
        const ix = (x) || canvas.width;
        const iy = (y) || Math.random() * (canvas.height - 20) + 10;
        const is = (strength) || Math.floor(Math.random() * 5) + 2;
        return new Stormtrooper(ix, iy, is);
    }

    shoot() {return;}

    special() {return;}

    changeDirection() {return;}

    escape() {
        player.getEnergy(-(this.initLives/2));
    }

    die() {
        super.die();
        player.getEnergy(this.initLives/2);
    }

    collide() {
        player.getEnergy(-this.initLives);
        player.loseLife(1);
        this.die();
    }
    
}