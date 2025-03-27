import { Player } from './Player.js';
export enum GameObjectType {SCHNAPPS, SHIELD, LEIA, SABER, R2D2, YODA, BLASTER, SPEEDUP, DISC, SHIELDUP, LIFE, BEAM, INVINCIBLE, SPRAY}
export const rareObjectTypes = [GameObjectType.YODA, GameObjectType.R2D2, GameObjectType.LEIA, GameObjectType.SABER];
export const normalObjectTypes = [GameObjectType.DISC, GameObjectType.SCHNAPPS, GameObjectType.BLASTER, GameObjectType.SPEEDUP, GameObjectType.SHIELD, GameObjectType.DISC];
export const specialObjectTypes = [GameObjectType.SHIELDUP, GameObjectType.LIFE, GameObjectType.BEAM, GameObjectType.INVINCIBLE, GameObjectType.SPRAY];

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
        this.image.src = 'img/' + GameObjectType[type].toLowerCase() + '.png';
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