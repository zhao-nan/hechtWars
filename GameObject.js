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
})(GameObjectType || (GameObjectType = {}));
export const rareObjectTypes = [GameObjectType.YODA, GameObjectType.R2D2, GameObjectType.LEIA, GameObjectType.SABER];
export const normalObjectTypes = [GameObjectType.DISC, GameObjectType.SCHNAPPS, GameObjectType.BLASTER, GameObjectType.SPEEDUP, GameObjectType.SHIELD, GameObjectType.DISC];
export class GameObject {
    constructor(x, y, type) {
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
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    isCloseEnough(player) {
        const distance = Math.hypot(this.x - player.x, this.y - player.y);
        return distance < 100;
    }
}
//# sourceMappingURL=GameObject.js.map