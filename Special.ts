export enum SpecialType {SHIELD, LIFE, BEAM, INVINCIBLE, SPRAY}

export class Special {
    
    type: SpecialType;
    image: HTMLImageElement;
    
    constructor(type: SpecialType) {
        this.type = type;
        this.image = new Image();
        this.image.src = 'img/special-' + SpecialType[type].toLowerCase() + '.png';
    }
    
}