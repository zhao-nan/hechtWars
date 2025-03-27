export var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["SCHNAPPS"] = 0] = "SCHNAPPS";
    GameObjectType[GameObjectType["SHIELD"] = 1] = "SHIELD";
    GameObjectType[GameObjectType["LEIA"] = 2] = "LEIA";
    GameObjectType[GameObjectType["SABER"] = 3] = "SABER";
    GameObjectType[GameObjectType["R2D2"] = 4] = "R2D2";
    GameObjectType[GameObjectType["YODA"] = 5] = "YODA";
    GameObjectType[GameObjectType["BLASTER"] = 6] = "BLASTER";
    GameObjectType[GameObjectType["SPEEDUP"] = 7] = "SPEEDUP";
    GameObjectType[GameObjectType["DISC"] = 8] = "DISC";
    GameObjectType[GameObjectType["SHIELDUP"] = 9] = "SHIELDUP";
    GameObjectType[GameObjectType["LIFE"] = 10] = "LIFE";
    GameObjectType[GameObjectType["BEAM"] = 11] = "BEAM";
    GameObjectType[GameObjectType["INVINCIBLE"] = 12] = "INVINCIBLE";
    GameObjectType[GameObjectType["SPRAY"] = 13] = "SPRAY";
})(GameObjectType || (GameObjectType = {}));
export const rareObjectTypes = [GameObjectType.YODA, GameObjectType.R2D2, GameObjectType.LEIA, GameObjectType.SABER];
export const normalObjectTypes = [GameObjectType.DISC, GameObjectType.SCHNAPPS, GameObjectType.BLASTER, GameObjectType.SPEEDUP, GameObjectType.SHIELD, GameObjectType.DISC];
export const specialObjectTypes = [GameObjectType.SHIELDUP, GameObjectType.LIFE, GameObjectType.BEAM, GameObjectType.INVINCIBLE, GameObjectType.SPRAY];
export class GameObject {
    constructor(x, y, type) {
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
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    isCloseEnough(player) {
        const distance = Math.hypot(this.x - player.x, this.y - player.y);
        return distance < 100;
    }
}
//# sourceMappingURL=GameObject.js.map