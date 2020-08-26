//=============================================================================
// RPG Maker MZ - Ignis Character After Image
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Character Trail/After Image
 * @author Reisen (Mauricio Pastana)

  * @help Ignis Character After Image - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! https://www.patreon.com/raizen884?fan_landing=true
 * Configure the parameters, to disable the actor after image, just create a plugin command redirecting
 * to the player with a high value on speed.


 * @command after Image Event
 * @text 
 * @desc Configure after image for events
 * 
 * @arg eventImageConfig
 * @type struct<ImageEvents>

 * @command after Image Player
 * @text 
 * @desc Configure after image for player
 * 
 * @arg playerImageConfig
 * @type struct<ImagePlayer>

 * @command after Image Stop Event
 * @text 
 * @desc Stops after image from certain events
 * 
 * @arg eventId
 * @type number

 * @param Player After Image
 * @type struct<AfterImage>
 * @text Default Player AfterImage
 *

 */
/*~struct~AfterImage:
 * @param extra images
 * @type number
 * @default 0
 * @desc Configure them putting on the suffix of the image name [AI1], [AI2]... for each extra image
 * @param shadow number
 * @type number
 * @default 15
 * @desc Quantity of after images
 * @param frequency
 * @type number
 * @default 3
 * @desc The lower, the faster the afterImages appear
 * @param fadeSpeed
 * @type number
 * @default 10
 * @desc The higher, the faster the afterImages fade away
 * @param needSpeed
 * @type number
 * @default 5
 * @desc The higher this number, the higher the character needs to go to produce afterimages, 0 to disable, 5 is default
 */

/*~struct~ImageEvents:
* @param eventId
* @type number
* @default 1
* @param extra images
* @type number
* @default 0
* @desc Configure them putting on the suffix of the image name [AI1], [AI2]... for each extra image
* @param shadow number
* @type number
* @default 15
* @desc Quantity of after images
* @param frequency
* @type number
* @default 3
* @desc The lower, the faster the afterImages appear
* @param fadeSpeed
* @type number
* @default 10
* @desc The higher, the faster the afterImages fade away
* @param needSpeed
* @type number
* @default 5
* @desc The higher this number, the higher the character needs to go to produce afterimages, 0 to disable, 5 is default
*/
/*~struct~ImagePlayer:
* @param shadow number
* @type number
* @default 15
* @desc Quantity of after images
* @param frequency
* @type number
* @default 3
* @desc The lower, the faster the afterImages appear
* @param fadeSpeed
* @type number
* @default 10
* @desc The higher, the faster the afterImages fade away
* @param needSpeed
* @type number
* @default 5
* @desc The higher this number, the higher the character needs to go to produce afterimages, 0 to disable, 5 is default

*/

//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Character After Image
//////////////////////////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// SceneManager
//
// The scene class of the Manager.
//=============================================================================
// onKeyDown - alias function
//=============================================================================


//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.
(() => {
    const pluginName = "IgnisCharacterAfterImage";
    const ignisParameters = PluginManager.parameters('IgnisCharacterAfterImage');
    const ignisPlayerValues = JSON.parse(ignisParameters['Player After Image']);


    PluginManager.registerCommand(pluginName, "after Image Event", args => {
        const arg = JSON.parse(args['eventImageConfig']);
        const events = $gameMap.events();
        const event = events.find(event => event.eventId() == arg['eventId'])
        event.configureAfterImage(arg['frequency'], arg['shadow number'], arg['needSpeed'])
        for (var n = 1; n < 15; n++) {
            SceneManager._scene._spriteset._characterSprites.push(new Sprite_Character_AfterImage(event, n, parseInt(arg['extra images'])));
            SceneManager._scene._spriteset._characterSprites[SceneManager._scene._spriteset._characterSprites.length - 1].configureAfterImage(arg['fadeSpeed'])
            SceneManager._scene._spriteset._tilemap.addChild(SceneManager._scene._spriteset._characterSprites[SceneManager._scene._spriteset._characterSprites.length - 1]);
        }
    });
    PluginManager.registerCommand(pluginName, "after Image Player", args => {
        const arg = JSON.parse(args['playerImageConfig']);
        const playerSprites = SceneManager._scene._spriteset._characterSprites.filter(player => player instanceof Sprite_Character_AfterImage && player.isAPlayer())
        for (const player of playerSprites) {
            player.configureAfterImage(arg['fadeSpeed']);
        }
        $gamePlayer.configureAfterImage(arg['frequency'], arg['shadow number'], arg['needSpeed'])
    });
    //=============================================================================
    // after Image Stop Event - stops event shadow
    //=============================================================================
    PluginManager.registerCommand(pluginName, "after Image Stop Event", args => {
        const arg = args['eventId'];
        const eventSprites = SceneManager._scene._spriteset._characterSprites.filter(event => event instanceof Sprite_Character_AfterImage && event.getEventAfterImageId() == parseInt(arg))
        for (const event of eventSprites) {
            SceneManager._scene._spriteset._tilemap.removeChild(event);
        }
    });
    //=============================================================================
    // createCharacters - alias function
    //=============================================================================
    let _ignisEngineAfterImage_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters
    Spriteset_Map.prototype.createCharacters = function () {
        _ignisEngineAfterImage_Spriteset_Map_createCharacters.call(this, ...arguments);
        for (var n = 1; n <= ignisPlayerValues['shadow number']; n++) {
            this._characterSprites.push(new Sprite_Character_AfterImage($gamePlayer, n, parseInt(ignisPlayerValues['extra images'])));
            this._tilemap.addChild(this._characterSprites[this._characterSprites.length - 1]);
        }
        for (const sprite of this._characterSprites) {
            this._tilemap.addChild(sprite);
        }
        while ($gameMap.hasAfterImageStruct()) {
            let struct = $gameMap.getAfterImageStruct()
            this._characterSprites.push(struct);
            this._tilemap.addChild(this._characterSprites[this._characterSprites.length - 1]);
            $gameMap.unloadAfterImageStruct();
        }
    };

    //-----------------------------------------------------------------------------
    // Sprite_Character_AfterImage
    //
    // The sprite for displaying a character After Image
    //-----------------------------------------------------------------------------
    function Sprite_Character_AfterImage() {
        this.initialize(...arguments);
    }

    Sprite_Character_AfterImage.prototype = Object.create(Sprite_Character.prototype);
    Sprite_Character_AfterImage.prototype.constructor = Sprite_Character_AfterImage;

    Sprite_Character_AfterImage.prototype.initialize = function (character, index, extraImages) {
        Sprite_Character.prototype.initialize.call(this, character);
        this._AfterImageIndex = index;
        this._fadeSpeed = ignisPlayerValues['fadeSpeed'];
        this._extraImages = extraImages;
        this._eventAfterImage = character.eventId == null ? false : character.eventId()
    };
    Sprite_Character_AfterImage.prototype.isAPlayer = function () {
        return !this._eventAfterImage;
    }
    Sprite_Character_AfterImage.prototype.getEventAfterImageId = function () {
        return this._eventAfterImage;
    }
    Sprite_Character_AfterImage.prototype.update = function () {
        if (this.opacity > 0) {
            this.updateAfterPosition();
            this.opacity -= this._fadeSpeed;
            return;
        }
        if (this._character.getAfterImageIndex() == this._AfterImageIndex) {
            this.updateAfterImage();
        }
        Sprite.prototype.update.call(this);

    };
    Sprite_Character_AfterImage.prototype.updateAfterImage = function () {
        this.updateBitmap();
        this.updateFrame();
        this.updateVisibility();
        this.updatePosition();
        this.opacity = 255;
        this._realX = this._character._realX;
        this._realY = this._character._realY;
        this._jumpHeight = this._character.jumpHeight();
    }
    Sprite_Character_AfterImage.prototype.updateAfterPosition = function () {
        this.x = this.screenX();
        this.y = this.screenY();
    }
    Sprite_Character_AfterImage.prototype.scrolledX = function () {
        return $gameMap.adjustX(this._realX);
    };
    Sprite_Character_AfterImage.prototype.scrolledY = function () {
        return $gameMap.adjustY(this._realY);
    };
    Sprite_Character_AfterImage.prototype.screenX = function () {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2);
    };
    Sprite_Character_AfterImage.prototype.screenY = function () {
        const th = $gameMap.tileHeight();
        return Math.floor(this.scrolledY() * th + th - this.shiftY() - this._jumpHeight);
    };
    Sprite_Character_AfterImage.prototype.shiftY = function () {
        return this._character.isObjectCharacter() ? 0 : 6;
    };
    Sprite_Character_AfterImage.prototype.setCharacterBitmap = function () {
        if (this._extraImages > 0) {
            this._characterName = this._characterName.concat(`[AI${this._AfterImageIndex % this._extraImages + 1}]`)
        }
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    };
    Sprite_Character_AfterImage.prototype.configureAfterImage = function (fadeSpeed) {
        this._fadeSpeed = fadeSpeed;
    };

    //=============================================================================
    // initMembers - alias function
    //=============================================================================
    let _ignisEngineAfterImage_Game_Character_initMembers = Game_Character.prototype.initMembers
    Game_Character.prototype.initMembers = function () {
        _ignisEngineAfterImage_Game_Character_initMembers.call(this, ...arguments);
        this._afterImageIndex = 0;
        this._afterImageFrequency = ignisPlayerValues['frequency'];
        this._afterImageMax = ignisPlayerValues['shadow number'];
        this._afterImageNeedSpeed = ignisPlayerValues['needSpeed'];
    };
    //=============================================================================
    // configureAfterImage - new function
    //=============================================================================
    Game_Character.prototype.configureAfterImage = function (frequency, max, needSpeed) {
        this._afterImageFrequency = frequency;
        this._afterImageMax = max;
        this._afterImageNeedSpeed = needSpeed;
    };
    //=============================================================================
    // update - alias function
    //=============================================================================
    let _ignisEngineAfterImage_Game_Character_update = Game_Character.prototype.update
    Game_Character.prototype.update = function () {
        _ignisEngineAfterImage_Game_Character_update.call(this, ...arguments)
        if (Graphics.frameCount % this._afterImageFrequency == 0)
            this._afterImageIndex = this._afterImageIndex < this._afterImageMax ? this._afterImageIndex + 1 : 1;
        if (this.realMoveSpeed() < this._afterImageNeedSpeed || this.checkStop(0)) { this._afterImageIndex = 0 };
    }
    //=============================================================================
    // getAfterImageIndex - new function
    //=============================================================================
    Game_Character.prototype.getAfterImageIndex = function () {
        return this._afterImageIndex;
    };
    //=============================================================================
    // initialize - alias function
    //=============================================================================
    let _ignisEngineAfterImage_Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function () {
        _ignisEngineAfterImage_Game_Map_initialize.call(this, ...arguments)
        this._afterImagesStructs = [];
    }
    //=============================================================================
    // hasAfterImageStruct - new function
    //=============================================================================
    Game_Map.prototype.hasAfterImageStruct = function () {
        return this._afterImagesStructs.length > 0;
    }
    //=============================================================================
    // addAfterImageStruct - new function
    //=============================================================================
    Game_Map.prototype.addAfterImageStruct = function (struct) {
        this._afterImagesStructs.push(struct)
    }
    //=============================================================================
    // getAfterImageStruct - new function
    //=============================================================================
    Game_Map.prototype.getAfterImageStruct = function () {
        return this._afterImagesStructs[0];
    }
    //=============================================================================
    // unloadAfterImageStruct - new function
    //=============================================================================
    Game_Map.prototype.unloadAfterImageStruct = function () {
        this._afterImagesStructs.shift()
    }
    //=============================================================================
    // terminate - alias function
    //=============================================================================
    let _ignisEngineAfterImage_Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        const afterImageSprites = this._spriteset._characterSprites.filter(event => event instanceof Sprite_Character_AfterImage && !event.isAPlayer())
        for (const struct of afterImageSprites) {
            $gameMap.addAfterImageStruct(struct)
            this._spriteset._tilemap.removeChild(struct)
        }
        _ignisEngineAfterImage_Scene_Map_terminate.call(this, ...arguments);
    };
})();