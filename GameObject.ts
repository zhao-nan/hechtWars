import { Player } from './Player.js';
export enum GameObjectType {SCHNAPPS, SHIELD, LEIA, SABER, R2D2, YODA, BLASTER, SPEEDUP, DISC}
export const rareObjectTypes = [GameObjectType.YODA, GameObjectType.R2D2, GameObjectType.LEIA, GameObjectType.SABER];
export const normalObjectTypes = [GameObjectType.DISC, GameObjectType.SCHNAPPS, GameObjectType.BLASTER, GameObjectType.SPEEDUP, GameObjectType.SHIELD, GameObjectType.DISC];

export class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    type: GameObjectType;
    image: HTMLImageElement;

    constructor(x: number, y: number, type: number) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.image = new Image();
        switch (this.type) {
            case GameObjectType.SCHNAPPS:
                this.image.src = 'img/schnaps.png';
                break;
            case GameObjectType.SHIELD:
                this.image.src = 'img/shield.png';
                break;
            case GameObjectType.LEIA:
                this.image.src = 'img/leia.png';
                break;
            case GameObjectType.SABER:
                this.image.src = 'img/lightsaber.png';
                this.width = 50;
                this.height = 40;
                break;
            case GameObjectType.R2D2:
                this.image.src = 'img/r2d2.png';
                this.width = 25;
                break;
            case GameObjectType.YODA:
                this.image.src = 'img/yoda.png';
                break;
            case GameObjectType.BLASTER:
                this.image.src = 'img/blaster.png';
                break;
            case GameObjectType.SPEEDUP:
                this.image.src = 'img/speedcannon.png';
                break;
            case GameObjectType.DISC:
                this.image.src = 'img/disc.png';
                break;
        }
    }

    update() {
        this.x -= 2; // Move objects to the left
    }

    isOutOfScreen() {
        return this.x < 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isCloseEnough(player: Player) {
        const distance = Math.hypot(this.x - player.x, this.y - player.y);
        return distance < 100; 
    }
}