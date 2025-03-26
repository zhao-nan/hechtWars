import { Enemy } from './Enemy.js';
import { player } from './hecht.js';

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

    shoot() {}

    special() {}

    changeDirection() {}

    escape() {
        player.points -= 100;
    }

    collide() {
        player.loseLife(1);
        this.die();
    }
    
}