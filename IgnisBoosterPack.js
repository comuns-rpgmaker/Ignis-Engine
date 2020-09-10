//=============================================================================
// Ignis Collectible Cards for RPG Maker MZ
//=============================================================================

/*:
* @target MZ
 * @plugindesc Ignis Collectible Cards, Compatible with Triple Triad MZ.
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * @help Ignis Collectible Card - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * 
 * This is the collectible cards for MZ! It has been optimized to be used with
 * Triple Triad, but you can use it by its own also.
 * It is very simple, just configure the parameters, you do not need to configure the cards
 * if you are using Triple Triad, if you want boosters to be items just create an usable
 * item that calls the booster opening scene.
 

 * @command Add Booster Pack
 * @desc Adds a booster pack to your inventory, configured on the parameters
 * 
 * @arg boosterNum
 * @type number
 * @arg cardsOpened
 * @type number
 * @desc Number of cards opened for the boosters above.
 * 
 * 
 * @command Open Booster Pack
 * @desc Opens a single booster pack or all, if you wish to use items for booster packs, I recomend single mode.
 * 
 * @arg single
 * @type boolean
 * @desc Single opens only one pack, if off, all packs will be opened.
 * 
 * @param Booster Pack Configuration
 * @type struct<BoosterConfig>[]
 * @desc Configure each booster here, card ids are automatic if using Triple Triad
 * 
 * @param Booster Scene Configuration
 * @type struct<BoosterScene>
 * @desc Configure each element in the booster pack screen
 * 
 * @param Card Configuration
 * @type struct<CardConfig>[]
 * @desc Configure each card here, only if you do not use triple triad plugin
 * 
 
*/
/*~struct~BoosterScene:
 * @param card positions
 * @type struct<CardPos>[]
 * @desc Position of each card on the booster pack
 * @param AnimationBooster
 * @type number
 * @desc number of the animation id to play when the booster is created
 * @param AnimationOpen
 * @type number
 * @desc number of the animation id to play when the booster is opened
 * @param BackImage
 * @type file
 * @dir img/Triple_Triad/
 * @desc Background Image
 * @param BackCard
 * @type file
 * @dir img/Triple_Triad/
 * @desc Image of the back of the card
*/

/*~struct~CardPos:
 * @param xPos
 * @type number
 * @min -10000
 * @text X position
 * @desc x position of the card
 * @param yPos
 * @type number
 * @min -10000
 * @text Y position
 * @desc y position of the card
*/

/*~struct~BoosterConfig:
 * @param cards
 * @type number[]
 * @desc cards on this booster but id.
 * @param boosterImage
 * @type file
 * @dir img/Triple_Triad/
 * @desc Image of the booster pack
*/

/*~struct~CardConfig:
 * @param Image_Player_1
 * @type file
 * @dir img/Triple_Triad/
 * @text Card Image
 * @param Rarity
 * @type number
 * @max 10
 * @min 1
 * @desc Rarity of the card, the higher, the harder to open on the booster pack
 * @param gainItem
 * @type number
 * @desc Item to be gained from the database, 0 if your cards are not items.
*/
var IgnisEngine = IgnisEngine || {};
IgnisEngine.BoosterPack = IgnisEngine.BoosterPack || {};
IgnisEngine.BoosterPack.VERSION = [1, 0, 0];




//-----------------------------------------------------------------------------
// Triple Triad Image Handler
//
// The scene class of the battle screen.

ImageManager.loadTripleTriad = function (filename, hue) {
    return this.loadBitmap('img/Triple_Triad/', filename, hue, true);
};

function Game_Ignis_Boosters() {
    this._packs = [];
    this._boosterpacks = [];
    this._boosterPackImages = [];
    if (IgnisEngine.TripleTriad)
        this.cardList = JSON.parse(PluginManager.parameters('tripleTriad')['Card Creation']);
    else
        this.cardList = IgnisEngine.BoosterPack.cardList;
    for (let n = 0; n < IgnisEngine.BoosterPack.boosterPackConfig.length; n++) {
        let config = JSON.parse(IgnisEngine.BoosterPack.boosterPackConfig[n]);
        let base = JSON.parse(config.cards).map(a => parseInt(a));
        this._boosterpacks[n] = [];
        for (const card of base) {
            cardRarity = parseInt(JSON.parse(this.cardList[card]).Rarity);
            for (var i = 0; i < cardRarity; i++)
                this._boosterpacks[n].push(card);
        }
        this._boosterPackImages[n] = config.boosterImage;
        console.log(this._boosterpacks[n])
    }
};

Game_Ignis_Boosters.prototype.openPack = function () {
    let pack = this.getPack();
    let newPack = [];
    for (let n = 0; n < pack[1]; n++) {
        let cardNum = this._boosterpacks[pack[0]][Math.randomInt(this._boosterpacks[pack[0]].length)];
        newPack.push(cardNum);
        if (IgnisEngine.TripleTriad)
            $dataTripleTriad.all_cards.push(cardNum);
        else {
            let cardList = JSON.parse(IgnisEngine.BoosterPack.cardList[cardNum]);
            $gameParty.gainItem($dataItems[parseInt(cardList.gainItem)], 1);
        }

    }
    return [newPack, this._boosterPackImages[pack[0]]];
};

Game_Ignis_Boosters.prototype.getPack = function () {
    return this._packs.shift();
};

Game_Ignis_Boosters.prototype.addPack = function (packNum, numCards) {
    return this._packs.push([packNum, numCards]);
};

Game_Ignis_Boosters.prototype.hasPacks = function () {
    return this._packs.length != 0;
};
Game_Ignis_Boosters.prototype.openSingle = function () {
    return this._openSingle;
};
Game_Ignis_Boosters.prototype.switchMode = function (mode) {
    this._openSingle = mode;
};
//-----------------------------------------------------------------------------
// Scene_Ignis_BoosterPack
//
// The superclass of all the menu-type scenes.

function Scene_Ignis_BoosterPack() {
    this.initialize(...arguments);
}

Scene_Ignis_BoosterPack.prototype = Object.create(Scene_Base.prototype);
Scene_Ignis_BoosterPack.prototype.constructor = Scene_Ignis_BoosterPack;
(() => {
    const pluginName2 = "IgnisBoosterPack";
    IgnisEngine.BoosterPack.params = PluginManager.parameters(pluginName2);
    IgnisEngine.BoosterPack.boosterPackConfig = JSON.parse(IgnisEngine.BoosterPack.params['Booster Pack Configuration']);
    IgnisEngine.BoosterPack.boosterSceneConfig = JSON.parse(IgnisEngine.BoosterPack.params['Booster Scene Configuration']);
    IgnisEngine.BoosterPack.positions = JSON.parse(IgnisEngine.BoosterPack.boosterSceneConfig["card positions"]);
    IgnisEngine.BoosterPack.cardPositions = [];
    IgnisEngine.BoosterPack.cardList = JSON.parse(PluginManager.parameters(pluginName2)['Card Configuration']);
    for (let n = 0; n < IgnisEngine.BoosterPack.positions.length; n++) {
        let value = JSON.parse(IgnisEngine.BoosterPack.positions[n]);
        IgnisEngine.BoosterPack.cardPositions[n] = [parseInt(value.xPos), parseInt(value.yPos)];
    }

    PluginManager.registerCommand(pluginName2, "Add Booster Pack", args => {
        const boosters = args["boosterNum"];
        const num = args["cardsOpened"];
        $gamePlayer.ignisBoosters.addPack(parseInt(boosters), parseInt(num));
    });

    PluginManager.registerCommand(pluginName2, "Open Booster Pack", args => {
        const singleMode = args["single"] == "true" ? true : false;
        $gamePlayer.ignisBoosters.switchMode(singleMode);
        if ($gamePlayer.ignisBoosters.hasPacks()) {
            SceneManager.push(Scene_Ignis_BoosterPack)
        }
    });

    Scene_Ignis_BoosterPack.prototype.initialize = function () {
        Scene_Base.prototype.initialize.call(this);
    };
    Scene_Ignis_BoosterPack.prototype.create = function () {
        Scene_Base.prototype.create.call(this);
        this.createBase();
        this.randomizeBooster();
        this.createVariables();
        this.createBackground();
        this.createCardBack();
        this.createCardFront();
        this.createBoosterPack();
    };
    Scene_Ignis_BoosterPack.prototype.randomizeBooster = function () {
        this._boosterCards = [];
        let info = $gamePlayer.ignisBoosters.openPack();
        this.pack = info[0];
        this._boosterPackImage = info[1];
    }

    Scene_Ignis_BoosterPack.prototype.createBase = function () {
        this.cardList = [];
        if (IgnisEngine.TripleTriad) {
            let cardList = JSON.parse(PluginManager.parameters('tripleTriad')['Card Creation']);
            for (const card of cardList) { this.cardList.push(JSON.parse(card)) };
        } else {
            let cardList = IgnisEngine.BoosterPack.cardList;
            for (const card of cardList) { this.cardList.push(JSON.parse(card)) };
        }
    };

    Scene_Ignis_BoosterPack.prototype.createCardBack = function () {
        this._backCards = [];
        for (var n = 0; n < this.pack.length; n++) {
            this._backCards[n] = new Sprite();
            this._backCards[n].bitmap = ImageManager.loadTripleTriad(IgnisEngine.BoosterPack.boosterSceneConfig.BackCard);
            this.addChild(this._backCards[n]);
            this._backCards[n].anchor.x = this._backCards[n].anchor.y = 0.5;
            this._backCards[n].x = Graphics.width / 2;
            this._backCards[n].y = Graphics.height / 2;
            this._backCards[n].opacity = 0;
        }
    };
    Scene_Ignis_BoosterPack.prototype.createCardFront = function () {
        this._frontCards = [];
        for (var n = 0; n < this.pack.length; n++) {
            this._frontCards[n] = new Sprite();
            this._frontCards[n].bitmap = ImageManager.loadTripleTriad(this.cardList[this.pack[n]]["Image_Player_1"]);
            this.addChild(this._frontCards[n]);
            this._frontCards[n].anchor.x = this._frontCards[n].anchor.y = 0.5;
            this._frontCards[n].x = Graphics.width / 2;
            this._frontCards[n].y = Graphics.height / 2;
            this._frontCards[n].scale.x = 0;
            this._frontCards[n].scale.y = 1.5;
        }
    };


    Scene_Ignis_BoosterPack.prototype.callAnimation = function (id, sprite) {
        this._fakeCenter = new Sprite_Animation();
        this._fakeCenter.setup([sprite], $dataAnimations[id], false);
        this.addChild(this._fakeCenter);
    };

    Scene_Ignis_BoosterPack.prototype.createVariables = function () {
        this._countFrames = 0;
        this._phase = 0;
        this._displacementY = 0;
        this._finalPositions = JSON.parse(JSON.stringify(IgnisEngine.BoosterPack.cardPositions));
        this._floatingCards = []
        for (var n = 0; n < this.pack.length; n++) {
            this._floatingCards[n] = [0, true];
        }
    };

    Scene_Ignis_BoosterPack.prototype.createBackground = function () {
        this._backGroundImg = new Sprite();
        this._backGroundImg.bitmap = ImageManager.loadTripleTriad(IgnisEngine.BoosterPack.boosterSceneConfig.BackImage);
        this.addChild(this._backGroundImg);
    };

    Scene_Ignis_BoosterPack.prototype.createBoosterPack = function () {
        this._boosterPack = new Sprite();
        this._boosterPack.bitmap = ImageManager.loadTripleTriad(this._boosterPackImage);
        this.addChild(this._boosterPack);
        this._boosterPack.anchor.x = this._boosterPack.anchor.y = 0.5;
        this._boosterPack.x = Graphics.width / 2;
        this._boosterPack.y = Graphics.height / 2;
        this._boosterPack.scale.x = 0;
    };

    Scene_Ignis_BoosterPack.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        this._countFrames++;
        switch (this._phase) {
            case -1:
                this.randomizeBooster();
                this.createVariables();
                this.createBackground();
                this.createCardBack();
                this.createCardFront();
                this.createBoosterPack();
                break;
            case 0:
                this.showBoosterPack();
                break;
            case 1:
                this.placeCardBack();
                break;
            case 2:
                this.cleanCards();
                break;
            case 3:
                this.closeScene();
                break;
        }
    };

    Scene_Ignis_BoosterPack.prototype.showBoosterPack = function () {
        if (this._countFrames == 1) {
            this.callAnimation(97, this._boosterPack)
        } else if (this._countFrames > 20 && this._boosterPack.scale.x < 1) {
            this._boosterPack.scale.x += 0.05;
        } else if (this._boosterPack.scale.x >= 1 && this._backCards[0].opacity == 0) {
            for (const card of this._backCards) {
                card.opacity = 255;
            }
        } else if (this._countFrames == 90) {
            this.callAnimation(48, this._boosterPack)
        } else if (this._boosterPack.scale.x >= 1 && this._countFrames > 90) {
            let displacement = this._countFrames % 2 == 0 ? this._countFrames - 90 : 90 - this._countFrames;
            this._boosterPack.x = Graphics.width / 2 + displacement / 2;
            this._boosterPack.opacity -= 5;
            if (this._countFrames > 130) {
                this._boosterPack.opacity -= 5;
            }
        }
        if (this._boosterPack.opacity == 0) {
            this._phase = 1;
        }
    };

    Scene_Ignis_BoosterPack.prototype.placeCardBack = function () {
        let cardNum = 0;
        for (let n = this._frontCards.length - 1; n >= 0; n--) {
            cardNum = n;
            if (this._frontCards[n].scale.x != 1)
                break;
            this.floatCards(cardNum);
        }
        this._displacementY += 3;
        for (let n = 0; n < cardNum; n++) {
            this._backCards[n].y = this._displacementY + Graphics.height / 2;
            this._frontCards[n].y = this._displacementY + Graphics.height / 2;
        }
        this.placeCards(cardNum);

    };
    Scene_Ignis_BoosterPack.prototype.floatCards = function (n) {

        if (this._floatingCards[n][1]) {
            this._floatingCards[n][0] -= 0.25;
            this._frontCards[n].y -= 0.25;
            if (this._floatingCards[n][0] < - 3) {
                this._floatingCards[n][1] = false;
            }
        } else {
            this._floatingCards[n][0] += 0.25;
            this._frontCards[n].y += 0.25;
            if (this._floatingCards[n][0] > 3) {
                this._floatingCards[n][1] = true;
            }
        }
    };


    Scene_Ignis_BoosterPack.prototype.placeCards = function (cardNum) {
        if (this._backCards[cardNum].scale.x > 0) {
            this._backCards[cardNum].scale.x -= 0.1;
            this._backCards[cardNum].scale.y += 0.05;
            this._backCards[cardNum].x += this._finalPositions[cardNum][0] / 21;
            this._backCards[cardNum].y -= this._finalPositions[cardNum][1] / 21;
            if (this._backCards[cardNum].scale.x <= 0) {
                this._backCards[cardNum].scale.x = 0;
                this._frontCards[cardNum].x = this._backCards[cardNum].x;
                this._frontCards[cardNum].y = this._backCards[cardNum].y;
            }
        } else {

            this._frontCards[cardNum].scale.x += 0.1;
            this._frontCards[cardNum].scale.y -= 0.05;
            this._frontCards[cardNum].x += this._finalPositions[cardNum][0] / 21;
            this._frontCards[cardNum].y -= this._finalPositions[cardNum][1] / 21;
            if (this._frontCards[cardNum].scale.x >= 1) {
                this._frontCards[cardNum].scale.x = 1;
                this._frontCards[cardNum].scale.y = 1;
                if (cardNum - 1 >= 0) {
                    this._finalPositions[cardNum - 1][1] += this._displacementY;
                }

                if (cardNum == 0) {
                    this._phase = 2;
                    this._countFrames = 0;
                }
            }
        }
    };

    Scene_Ignis_BoosterPack.prototype.cleanCards = function () {
        for (var n = 0; n < this.pack.length; n++) {
            if (this._countFrames / 10 >= n + 1) {
                this._frontCards[n].x += this._countFrames - 20 - (10 * n);
                this._frontCards[n].y += (this._countFrames - 20 - (10 * n)) / 8;
            }
        }
        if (this._frontCards[this.pack.length - 1].x > Graphics.width + 100) {
            if ($gamePlayer.ignisBoosters.hasPacks() && !$gamePlayer.ignisBoosters.openSingle())
                this._phase = -1;
            else
                this._phase = 3;
        }
    }
    Scene_Ignis_BoosterPack.prototype.closeScene = function () {
        this._backGroundImg.opacity -= 10;
        if (this._backGroundImg.opacity == 0)
            SceneManager.pop();
    };

    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function () {
        _Game_Player_initialize.call(this, ...arguments);
        this.ignisBoosters = new Game_Ignis_Boosters();
        this._openSingle = true;
    };

})();