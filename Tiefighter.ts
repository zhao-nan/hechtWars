import { Enemy } from './Enemy.js';
import { Bullet } from './Bullet.js';
import { canvas, player, objects, bullets} from './hecht.js';
import { GameObject, GameObjectType } from './GameObject.js';

export class Tiefighter extends Enemy {

    constructor(x: number, y: number) {
        super(x, y);
        this.lives = Math.floor(Math.random() * 5) + 2;
        this.initLives = this.lives;
        this.speed = Math.random() * 5 + 1;
        this.width = 30;
        this.height = 30;
        this.image.src = 'img/tie.png';
    }

    shoot() {     
        const now = Date.now();
        if (now - this.lastShotTime > Math.random() * 1000 + 1750) { 
            const bullet = new Bullet(this.x - 2, this.y + this.height, 4, this.speed * (-1) - 3, 0, 
            false, false, 1);
            bullets.push(bullet);
            this.lastShotTime = now;
        }
    }

    special() {return;}

    escape() {return;}

    collide() {
        player.loseLife(1);
        this.die();
    }

    die() {
        super.die();
        let irand = Math.random();
        if (irand > 0.5) {
            const t = this.chooseObjType(irand);
            objects.push(new GameObject(this.x, this.y, t));
        }
    }

    changeDirection() {
        let rand = Math.floor(Math.random() * 3);
        if (rand == 0 && this.y < canvas.height - this.height && this.yspeed < 2) {    
            this.yspeed += 0.1;
        } else if (rand == 1 && this.y > 25 && this.yspeed > -2) {
            this.yspeed -= 0.1;
        }
        if (this.y > canvas.height - this.height) {
            this.yspeed = -0.3;
        }
        if (this.y < 25) {
            this.yspeed = 0.3;
        }
        this.y += this.yspeed;
    }

    chooseObjType(irand: number) {
        let t: GameObjectType;
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                if (player.lives < 5) {
                    t = GameObjectType.SCHNAPPS;
                } else {
                    t = irand > 0.75 ? GameObjectType.BLASTER : GameObjectType.SPEEDUP;
                }
                break;
            case 1:
                if (player.shields < 5) {
                    t = GameObjectType.SHIELD;
                } else {
                    t = irand > 0.75 ? GameObjectType.BLASTER : GameObjectType.SPEEDUP;
                }
                break;
            case 2:
                t = irand > 0.75 ? GameObjectType.BLASTER : GameObjectType.SPEEDUP;
                break;
        }
        return t;
    }

}