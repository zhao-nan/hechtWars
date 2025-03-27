export var SpecialType;
(function (SpecialType) {
    SpecialType[SpecialType["SHIELD"] = 0] = "SHIELD";
    SpecialType[SpecialType["LIFE"] = 1] = "LIFE";
    SpecialType[SpecialType["BEAM"] = 2] = "BEAM";
    SpecialType[SpecialType["INVINCIBLE"] = 3] = "INVINCIBLE";
    SpecialType[SpecialType["SPRAY"] = 4] = "SPRAY";
})(SpecialType || (SpecialType = {}));
export class Special {
    constructor(type) {
        this.type = type;
        this.image = new Image();
        this.image.src = 'img/special-' + SpecialType[type].toLowerCase() + '.png';
    }
}
//# sourceMappingURL=Special.js.map